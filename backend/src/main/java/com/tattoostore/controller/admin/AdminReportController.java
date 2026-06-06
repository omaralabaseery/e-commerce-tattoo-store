package com.tattoostore.controller.admin;

import com.tattoostore.service.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@Tag(name = "Admin · Reports")
@PreAuthorize("hasAuthority('REPORT_VIEW')")
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        return reportService.overview();
    }

    @GetMapping("/sales")
    public Map<String, Object> sales(@RequestParam(defaultValue = "30") int days) {
        return reportService.sales(days);
    }

    @GetMapping("/orders")
    public Map<String, Object> orders() {
        return reportService.ordersByStatus();
    }

    @GetMapping("/inventory")
    public Map<String, Object> inventory() {
        return reportService.inventory();
    }
}
