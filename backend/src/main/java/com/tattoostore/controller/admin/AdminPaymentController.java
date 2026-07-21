package com.tattoostore.controller.admin;

import com.tattoostore.dto.PageResponse;
import com.tattoostore.entity.Payment;
import com.tattoostore.repository.OrderRepository;
import com.tattoostore.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Tag(name = "Admin · Payments")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','ORDER_MANAGER')")
public class AdminPaymentController {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public record PaymentRow(
            Long id, Long orderId, String orderNumber, String customerName,
            String paymentMethod, String transactionId, BigDecimal amount,
            String status, Instant createdAt) {}

    @GetMapping
    public PageResponse<PaymentRow> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return PageResponse.of(paymentRepository
                .findAll(PageRequest.of(page, size, Sort.by("id").descending()))
                .map(this::toRow));
    }

    private PaymentRow toRow(Payment p) {
        var order = orderRepository.findById(p.getOrderId()).orElse(null);
        return new PaymentRow(
                p.getId(), p.getOrderId(),
                order != null ? order.getOrderNumber() : null,
                order != null ? order.getCustomerName() : null,
                p.getPaymentMethod(), p.getTransactionId(), p.getAmount(),
                p.getStatus(), p.getCreatedAt());
    }
}
