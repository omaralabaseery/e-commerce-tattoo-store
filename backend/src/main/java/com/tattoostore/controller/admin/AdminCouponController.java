package com.tattoostore.controller.admin;

import com.tattoostore.dto.CouponDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.service.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "Admin · Coupons")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    public PageResponse<CouponResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return couponService.list(page, size);
    }

    @PostMapping
    public CouponResponse create(@Valid @RequestBody CouponRequest req) {
        return couponService.create(req);
    }

    @PutMapping("/{id}")
    public CouponResponse update(@PathVariable Long id, @Valid @RequestBody CouponRequest req) {
        return couponService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        couponService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
