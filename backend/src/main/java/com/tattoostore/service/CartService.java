package com.tattoostore.service;

import com.tattoostore.dto.CartDtos.*;
import com.tattoostore.entity.Cart;
import com.tattoostore.entity.CartItem;
import com.tattoostore.entity.Product;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.CartRepository;
import com.tattoostore.repository.ProductRepository;
import com.tattoostore.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Cart for both authenticated users (by userId) and guests (by session id,
 * supplied via the {@code X-Session-Id} header).
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CurrentUser currentUser;

    @Transactional
    public CartResponse getCart(String sessionId) {
        return toResponse(resolveCart(sessionId, true));
    }

    @Transactional
    public CartResponse addItem(String sessionId, AddItemRequest req) {
        Cart cart = resolveCart(sessionId, true);
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        if (product.getStockQuantity() < req.quantity()) {
            throw ApiException.badRequest("Not enough stock for " + product.getName());
        }
        BigDecimal price = effectivePrice(product);
        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(req.productId()))
                .findFirst()
                .ifPresentOrElse(
                        i -> i.setQuantity(i.getQuantity() + req.quantity()),
                        () -> cart.getItems().add(CartItem.builder()
                                .productId(req.productId())
                                .quantity(req.quantity())
                                .price(price)
                                .build()));
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(String sessionId, Long itemId, UpdateItemRequest req) {
        Cart cart = resolveCart(sessionId, false);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId)).findFirst()
                .orElseThrow(() -> ApiException.notFound("Cart item not found"));
        item.setQuantity(req.quantity());
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(String sessionId, Long itemId) {
        Cart cart = resolveCart(sessionId, false);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse clear(String sessionId) {
        Cart cart = resolveCart(sessionId, false);
        cart.getItems().clear();
        return toResponse(cartRepository.save(cart));
    }

    // ---------- helpers ----------

    private Cart resolveCart(String sessionId, boolean createIfMissing) {
        Long userId = currentUser.findOptional().map(u -> u.getId()).orElse(null);
        Cart cart = null;
        if (userId != null) {
            cart = cartRepository.findByUserId(userId).orElse(null);
        } else if (sessionId != null && !sessionId.isBlank()) {
            cart = cartRepository.findBySessionId(sessionId).orElse(null);
        }
        if (cart == null) {
            if (!createIfMissing) throw ApiException.notFound("Cart not found");
            cart = cartRepository.save(Cart.builder().userId(userId).sessionId(sessionId).build());
        }
        return cart;
    }

    private BigDecimal effectivePrice(Product p) {
        return p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            Product p = productRepository.findById(item.getProductId()).orElse(null);
            String name = p != null ? p.getName() : "Unknown";
            String img = (p != null && !p.getImages().isEmpty()) ? p.getImages().get(0).getImageUrl() : null;
            BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartItemResponse(item.getId(), item.getProductId(), name, img,
                    item.getPrice(), item.getQuantity(), lineTotal);
        }).toList();
        BigDecimal subtotal = items.stream().map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = items.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(cart.getId(), items, subtotal, count);
    }
}
