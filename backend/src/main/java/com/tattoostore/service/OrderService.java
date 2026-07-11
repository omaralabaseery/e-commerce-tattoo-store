package com.tattoostore.service;

import com.tattoostore.dto.OrderDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.entity.*;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.*;
import com.tattoostore.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

// Read-only transactions by default so mapping the lazy items collection works
// with open-in-view disabled; mutators carry their own @Transactional.
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of(
            "PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY",
            "DELIVERED", "CANCELLED", "RETURNED");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final InventoryTransactionRepository inventoryRepository;
    private final CurrentUser currentUser;

    @Value("${app.store.default-delivery-fee}")
    private BigDecimal defaultDeliveryFee;

    @Transactional
    public OrderResponse create(CreateOrderRequest req) {
        Long userId = currentUser.findOptional().map(User::getId).orElse(null);

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .userId(userId)
                .customerName(req.customerName())
                .customerPhone(req.customerPhone())
                .customerEmail(req.customerEmail())
                .addressId(req.addressId())
                .paymentMethod(req.paymentMethod())
                .notes(req.notes())
                .deliveryFee(defaultDeliveryFee)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderLineRequest line : req.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> ApiException.notFound("Product not found: " + line.productId()));
            if (product.getStockQuantity() < line.quantity()) {
                throw ApiException.badRequest("Not enough stock for " + product.getName());
            }
            BigDecimal unitPrice = product.getDiscountPrice() != null
                    ? product.getDiscountPrice() : product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(line.quantity()));
            subtotal = subtotal.add(lineTotal);

            order.getItems().add(OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .sku(product.getSku())
                    .quantity(line.quantity())
                    .unitPrice(unitPrice)
                    .totalPrice(lineTotal)
                    .build());

            // decrement stock + record inventory transaction
            product.setStockQuantity(product.getStockQuantity() - line.quantity());
            productRepository.save(product);
            inventoryRepository.save(InventoryTransaction.builder()
                    .productId(product.getId())
                    .type("STOCK_OUT")
                    .quantity(line.quantity())
                    .reason("Order " + order.getOrderNumber())
                    .createdBy(userId)
                    .build());
        }

        BigDecimal discount = applyCoupon(req.couponCode(), subtotal, order);
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.setTotalAmount(subtotal.subtract(discount).add(order.getDeliveryFee())
                .setScale(3, RoundingMode.HALF_UP));

        // Cash on delivery is "pending" until delivered; online payments handled by PaymentService
        return toResponse(orderRepository.save(order));
    }

    private BigDecimal applyCoupon(String code, BigDecimal subtotal, Order order) {
        if (code == null || code.isBlank()) return BigDecimal.ZERO;
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> ApiException.badRequest("Invalid coupon code"));
        Instant now = Instant.now();
        boolean active = "ACTIVE".equals(coupon.getStatus())
                && (coupon.getStartDate() == null || !coupon.getStartDate().isAfter(now))
                && (coupon.getEndDate() == null || !coupon.getEndDate().isBefore(now))
                && (coupon.getUsageLimit() == null || coupon.getUsedCount() < coupon.getUsageLimit());
        if (!active) throw ApiException.badRequest("Coupon is not valid");
        if (subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw ApiException.badRequest("Order does not meet the coupon minimum");
        }
        BigDecimal discount = "PERCENTAGE".equals(coupon.getType())
                ? subtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100), 3, RoundingMode.HALF_UP)
                : coupon.getValue();
        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        order.setCouponCode(coupon.getCode());
        return discount.min(subtotal);
    }

    public OrderResponse getOwn(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        Long userId = currentUser.requireId();
        if (order.getUserId() != null && !order.getUserId().equals(userId)) {
            throw ApiException.notFound("Order not found");
        }
        return toResponse(order);
    }

    public PageResponse<OrderResponse> myOrders(int page, int size) {
        Long userId = currentUser.requireId();
        return PageResponse.of(orderRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .map(this::toResponse));
    }

    // ---------- admin ----------

    public PageResponse<OrderResponse> adminList(String status, int page, int size) {
        Page<Order> result = (status == null || status.isBlank())
                ? orderRepository.findAll(PageRequest.of(page, size))
                : orderRepository.findByOrderStatus(status, PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toResponse));
    }

    public OrderResponse adminGet(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found")));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String status) {
        if (!VALID_STATUSES.contains(status)) throw ApiException.badRequest("Invalid status: " + status);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        order.setOrderStatus(status);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancel(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        if ("DELIVERED".equals(order.getOrderStatus())) {
            throw ApiException.badRequest("Delivered orders cannot be cancelled");
        }
        // restock
        for (OrderItem item : order.getItems()) {
            if (item.getProductId() == null) continue;
            productRepository.findById(item.getProductId()).ifPresent(p -> {
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                productRepository.save(p);
                inventoryRepository.save(InventoryTransaction.builder()
                        .productId(p.getId()).type("RETURNED").quantity(item.getQuantity())
                        .reason("Cancelled order " + order.getOrderNumber()).build());
            });
        }
        order.setOrderStatus("CANCELLED");
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse refund(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        order.setPaymentStatus("REFUNDED");
        return toResponse(orderRepository.save(order));
    }

    private String generateOrderNumber() {
        String ts = DateTimeFormatter.ofPattern("yyMMddHHmmss")
                .withZone(ZoneOffset.UTC).format(Instant.now());
        return "TS-" + ts;
    }

    private OrderResponse toResponse(Order o) {
        List<OrderItemResponse> items = o.getItems().stream()
                .map(i -> new OrderItemResponse(i.getId(), i.getProductId(), i.getProductName(),
                        i.getSku(), i.getQuantity(), i.getUnitPrice(), i.getTotalPrice()))
                .toList();
        return new OrderResponse(o.getId(), o.getOrderNumber(), o.getUserId(),
                o.getCustomerName(), o.getCustomerPhone(), o.getCustomerEmail(),
                o.getSubtotal(), o.getDiscountAmount(), o.getDeliveryFee(), o.getTotalAmount(),
                o.getCouponCode(), o.getPaymentMethod(), o.getPaymentStatus(), o.getOrderStatus(),
                o.getNotes(), o.getCreatedAt(), items);
    }
}
