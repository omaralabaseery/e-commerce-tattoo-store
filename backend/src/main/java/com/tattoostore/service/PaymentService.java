package com.tattoostore.service;

import com.tattoostore.dto.PaymentDtos.*;
import com.tattoostore.entity.Order;
import com.tattoostore.entity.Payment;
import com.tattoostore.exception.ApiException;
import com.tattoostore.payment.PaymentGateway;
import com.tattoostore.payment.PaymentInitResult;
import com.tattoostore.payment.PaymentWebhookResult;
import com.tattoostore.repository.OrderRepository;
import com.tattoostore.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final List<PaymentGateway> gateways;

    /** Resolve a gateway by provider key; falls back to MOCK in development. */
    private PaymentGateway gatewayFor(String paymentMethod) {
        String provider = switch (paymentMethod == null ? "" : paymentMethod) {
            case "KNET", "CARD", "APPLE_PAY" -> resolveConfiguredProvider();
            default -> "MOCK";
        };
        return gateways.stream()
                .filter(g -> g.provider().equalsIgnoreCase(provider))
                .findFirst()
                .orElseGet(() -> gateways.stream()
                        .filter(g -> g.provider().equalsIgnoreCase("MOCK"))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No payment gateway available")));
    }

    /** Hook for real provider selection (e.g. read from settings). Defaults to MOCK. */
    private String resolveConfiguredProvider() {
        return "MOCK"; // swap for "KNET" / "MYFATOORAH" / "STRIPE" once a real gateway bean is registered
    }

    @Transactional
    public CreatePaymentResponse create(CreatePaymentRequest req) {
        Order order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> ApiException.notFound("Order not found"));

        // Cash on delivery does not require an online payment session
        if ("COD".equals(order.getPaymentMethod())) {
            Payment cod = paymentRepository.save(Payment.builder()
                    .orderId(order.getId()).paymentMethod("COD")
                    .amount(order.getTotalAmount()).status("PENDING").build());
            return new CreatePaymentResponse(String.valueOf(cod.getId()), null, "PENDING");
        }

        PaymentGateway gateway = gatewayFor(order.getPaymentMethod());
        String returnUrl = req.returnUrl() != null ? req.returnUrl() : "http://localhost:3000/checkout/return";
        PaymentInitResult init = gateway.createPayment(order, returnUrl);

        paymentRepository.save(Payment.builder()
                .orderId(order.getId())
                .paymentMethod(order.getPaymentMethod())
                .transactionId(init.transactionId())
                .amount(order.getTotalAmount())
                .status(init.status())
                .build());

        return new CreatePaymentResponse(init.transactionId(), init.redirectUrl(), init.status());
    }

    /**
     * Generic webhook entrypoint. The provider is identified by the {@code provider}
     * query/path param; the gateway verifies the signature before we trust the result.
     */
    @Transactional
    public void handleWebhook(String provider, Map<String, String> headers, String rawBody) {
        PaymentGateway gateway = gateways.stream()
                .filter(g -> g.provider().equalsIgnoreCase(provider))
                .findFirst()
                .orElseThrow(() -> ApiException.badRequest("Unknown payment provider: " + provider));

        PaymentWebhookResult result = gateway.handleWebhook(headers, rawBody);
        if (!result.signatureValid()) {
            throw ApiException.unauthorized("Webhook signature verification failed");
        }

        Payment payment = paymentRepository.findByTransactionId(result.transactionId())
                .orElseThrow(() -> ApiException.notFound("Payment not found for transaction"));
        payment.setStatus(result.status());
        payment.setResponseData(rawBody);
        paymentRepository.save(payment);

        orderRepository.findById(payment.getOrderId()).ifPresent(order -> {
            order.setPaymentStatus(result.status());
            if ("PAID".equals(result.status()) && "PENDING".equals(order.getOrderStatus())) {
                order.setOrderStatus("CONFIRMED");
            }
            orderRepository.save(order);
        });
    }

    public List<PaymentResponse> getByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(p -> new PaymentResponse(p.getId(), p.getOrderId(), p.getPaymentMethod(),
                        p.getTransactionId(), p.getAmount(), p.getStatus(), p.getCreatedAt()))
                .toList();
    }
}
