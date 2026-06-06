package com.tattoostore.payment;

import com.tattoostore.entity.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/**
 * Default no-credentials gateway so checkout works end-to-end in development.
 * It immediately returns a fake redirect URL; the webhook endpoint can be called
 * (e.g. from the frontend "simulate payment" button) to mark the order PAID.
 *
 * Replace/augment with a real {@link PaymentGateway} bean for production.
 */
@Component
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public String provider() {
        return "MOCK";
    }

    @Override
    public PaymentInitResult createPayment(Order order, String returnUrl) {
        String txn = "MOCK-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        // In a real gateway this URL points to the provider's hosted page.
        String redirect = returnUrl + "?txn=" + txn + "&order=" + order.getOrderNumber();
        return new PaymentInitResult(txn, redirect, "PENDING");
    }

    @Override
    public PaymentWebhookResult handleWebhook(Map<String, String> headers, String rawBody) {
        // Mock payload format: txn=...;order=...;status=PAID;amount=10.000
        String txn = null, order = null, status = "PAID";
        BigDecimal amount = BigDecimal.ZERO;
        for (String part : rawBody.split(";")) {
            String[] kv = part.split("=", 2);
            if (kv.length != 2) continue;
            switch (kv[0].trim()) {
                case "txn" -> txn = kv[1].trim();
                case "order" -> order = kv[1].trim();
                case "status" -> status = kv[1].trim();
                case "amount" -> amount = new BigDecimal(kv[1].trim());
            }
        }
        // Mock gateway trusts the payload; real impls verify HMAC/signature here.
        return new PaymentWebhookResult(txn, order, status, amount, true);
    }
}
