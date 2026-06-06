package com.tattoostore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public final class CartDtos {
    private CartDtos() {}

    public record AddItemRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity
    ) {}

    public record UpdateItemRequest(@NotNull @Min(1) Integer quantity) {}

    public record CartItemResponse(
            Long id, Long productId, String name, String imageUrl,
            BigDecimal price, Integer quantity, BigDecimal lineTotal
    ) {}

    public record CartResponse(
            Long id,
            List<CartItemResponse> items,
            BigDecimal subtotal,
            Integer itemCount
    ) {}
}
