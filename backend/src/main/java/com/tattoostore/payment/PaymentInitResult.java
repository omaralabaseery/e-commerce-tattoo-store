package com.tattoostore.payment;

/**
 * Result of initiating a payment with a provider.
 *
 * @param transactionId provider transaction reference
 * @param redirectUrl   URL to redirect the customer to (hosted checkout / 3DS)
 * @param status        initial status, e.g. PENDING
 */
public record PaymentInitResult(String transactionId, String redirectUrl, String status) {
}
