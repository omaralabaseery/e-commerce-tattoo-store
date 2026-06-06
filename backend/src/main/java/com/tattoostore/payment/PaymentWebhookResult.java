package com.tattoostore.payment;

import java.math.BigDecimal;

/**
 * Normalized outcome parsed from a provider webhook/callback.
 *
 * @param transactionId provider transaction reference
 * @param orderNumber   our order number (echoed back by the provider)
 * @param status        normalized status: PAID | FAILED | REFUNDED
 * @param amount        amount confirmed by the provider
 * @param signatureValid whether the webhook signature verified successfully
 */
public record PaymentWebhookResult(
        String transactionId,
        String orderNumber,
        String status,
        BigDecimal amount,
        boolean signatureValid) {
}
