package com.tattoostore.service;

import com.tattoostore.dto.CouponDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.entity.Coupon;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;

    public PageResponse<CouponResponse> list(int page, int size) {
        return PageResponse.of(couponRepository
                .findAll(PageRequest.of(page, size, Sort.by("id").descending()))
                .map(this::toResponse));
    }

    @Transactional
    public CouponResponse create(CouponRequest req) {
        couponRepository.findByCodeIgnoreCase(req.code()).ifPresent(c -> {
            throw ApiException.conflict("Coupon code already exists");
        });
        Coupon c = Coupon.builder()
                .code(req.code().trim().toUpperCase())
                .usedCount(0)
                .minOrderAmount(BigDecimal.ZERO)
                .status("ACTIVE")
                .build();
        apply(c, req);
        return toResponse(couponRepository.save(c));
    }

    @Transactional
    public CouponResponse update(Long id, CouponRequest req) {
        Coupon c = couponRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Coupon not found"));
        couponRepository.findByCodeIgnoreCase(req.code())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> { throw ApiException.conflict("Coupon code already exists"); });
        apply(c, req);
        return toResponse(couponRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!couponRepository.existsById(id)) throw ApiException.notFound("Coupon not found");
        couponRepository.deleteById(id);
    }

    private void apply(Coupon c, CouponRequest req) {
        c.setCode(req.code().trim().toUpperCase());
        c.setType("FIXED".equalsIgnoreCase(req.type()) ? "FIXED" : "PERCENTAGE");
        c.setValue(req.value());
        c.setMinOrderAmount(req.minOrderAmount() != null ? req.minOrderAmount() : BigDecimal.ZERO);
        c.setMaxDiscount(req.maxDiscount());
        c.setUsageLimit(req.usageLimit());
        c.setStartDate(req.startDate());
        c.setEndDate(req.endDate());
        if (req.status() != null && !req.status().isBlank()) c.setStatus(req.status());
    }

    private CouponResponse toResponse(Coupon c) {
        return new CouponResponse(c.getId(), c.getCode(), c.getType(), c.getValue(),
                c.getMinOrderAmount(), c.getMaxDiscount(), c.getUsageLimit(), c.getUsedCount(),
                c.getStartDate(), c.getEndDate(), c.getStatus());
    }
}
