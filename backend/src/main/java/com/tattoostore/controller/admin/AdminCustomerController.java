package com.tattoostore.controller.admin;

import com.tattoostore.dto.PageResponse;
import com.tattoostore.service.CustomerService;
import com.tattoostore.service.CustomerService.CustomerResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin · Customers")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPPORT_AGENT')")
public class AdminCustomerController {

    private final CustomerService customerService;

    @GetMapping
    public PageResponse<CustomerResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return customerService.list(search, page, size);
    }
}
