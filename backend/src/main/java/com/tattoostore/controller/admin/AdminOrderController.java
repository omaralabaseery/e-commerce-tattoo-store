package com.tattoostore.controller.admin;

import com.tattoostore.dto.OrderDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin · Orders")
@PreAuthorize("hasAuthority('ORDER_MANAGE')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public PageResponse<OrderResponse> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return orderService.adminList(status, page, size);
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable Long id) {
        return orderService.adminGet(id);
    }

    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return orderService.updateStatus(id, req.status());
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id) {
        return orderService.cancel(id);
    }

    @PostMapping("/{id}/refund")
    public OrderResponse refund(@PathVariable Long id) {
        return orderService.refund(id);
    }
}
