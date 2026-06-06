package com.tattoostore.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public final class PaymentDtos {
    private PaymentDtos() {}

    public record CreatePaymentRequest(
            @NotNull Long orderId,
            String returnUrl
    ) {}

    public record CreatePaymentResponse(
            String transactionId,
            String redirectUrl,
            String status
    ) {}

    public record PaymentResponse(
            Long id, Long orderId, String paymentMethod, String transactionId,
            BigDecimal amount, String status, Instant createdAt
    ) {}
}
