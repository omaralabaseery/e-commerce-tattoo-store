package com.tattoostore.payment;

import com.tattoostore.entity.Order;

import java.util.Map;

/**
 * Abstraction over a payment provider. Implement this interface for KNET,
 * MyFatoorah, Stripe, etc. and register it as a Spring bean named after the
 * provider. {@code PaymentService} resolves the right gateway per order.
 *
 * The default {@link MockPaymentGateway} lets the full checkout/payment flow
 * run end-to-end without real provider credentials.
 */
public interface PaymentGateway {

    /** Provider key, e.g. "MOCK", "KNET", "MYFATOORAH", "STRIPE". */
    String provider();

    /**
     * Create a payment session/intent for the given order.
     * @return a result containing the transaction id and a redirect/checkout URL.
     */
    PaymentInitResult createPayment(Order order, String returnUrl);

    /**
     * Verify and interpret an inbound webhook/callback from the provider.
     * Implementations MUST verify the payload signature before trusting it.
     */
    PaymentWebhookResult handleWebhook(Map<String, String> headers, String rawBody);
}
