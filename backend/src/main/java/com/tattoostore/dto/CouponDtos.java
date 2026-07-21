package com.tattoostore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.Instant;

public final class CouponDtos {
    private CouponDtos() {}

    public record CouponRequest(
            @NotBlank String code,
            @NotBlank String type,               // PERCENTAGE | FIXED
            @NotNull @PositiveOrZero BigDecimal value,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscount,
            Integer usageLimit,
            Instant startDate,
            Instant endDate,
            String status                        // ACTIVE | INACTIVE
    ) {}

    public record CouponResponse(
            Long id, String code, String type, BigDecimal value,
            BigDecimal minOrderAmount, BigDecimal maxDiscount,
            Integer usageLimit, Integer usedCount,
            Instant startDate, Instant endDate, String status
    ) {}
}
