package com.tattoostore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OrderDtos {
    private OrderDtos() {}

    public record OrderLineRequest(@NotNull Long productId, @NotNull Integer quantity) {}

    public record CreateOrderRequest(
            @NotBlank String customerName,
            @NotBlank String customerPhone,
            String customerEmail,
            Long addressId,
            @NotBlank String paymentMethod,        // KNET | CARD | APPLE_PAY | COD
            String couponCode,
            String notes,
            @NotEmpty List<OrderLineRequest> items
    ) {}

    public record OrderItemResponse(
            Long id, Long productId, String productName, String sku,
            Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice
    ) {}

    public record OrderResponse(
            Long id, String orderNumber, Long userId,
            String customerName, String customerPhone, String customerEmail,
            BigDecimal subtotal, BigDecimal discountAmount, BigDecimal deliveryFee,
            BigDecimal totalAmount, String couponCode,
            String paymentMethod, String paymentStatus, String orderStatus,
            String notes, Instant createdAt,
            List<OrderItemResponse> items
    ) {}

    public record UpdateStatusRequest(@NotBlank String status) {}

    public record AdminNoteRequest(@NotBlank String note) {}
}
