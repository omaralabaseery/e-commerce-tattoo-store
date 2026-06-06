package com.tattoostore.controller;

import com.tattoostore.dto.PaymentDtos.*;
import com.tattoostore.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public CreatePaymentResponse create(@Valid @RequestBody CreatePaymentRequest req) {
        return paymentService.create(req);
    }

    /**
     * Provider webhook/callback. Public endpoint — the gateway implementation
     * verifies the signature before the result is trusted.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestParam(defaultValue = "MOCK") String provider,
            @RequestBody String rawBody,
            HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        for (String name : Collections.list(request.getHeaderNames())) {
            headers.put(name, request.getHeader(name));
        }
        paymentService.handleWebhook(provider, headers, rawBody);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}")
    public List<PaymentResponse> byOrder(@PathVariable Long orderId) {
        return paymentService.getByOrder(orderId);
    }
}
