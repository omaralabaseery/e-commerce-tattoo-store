package com.tattoostore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

public final class CatalogDtos {
    private CatalogDtos() {}

    public record ImageDto(Long id, String imageUrl, Integer sortOrder) {}

    public record AttributeDto(String name, String value) {}

    public record ProductResponse(
            Long id, String name, String slug, String sku,
            String description, String shortDescription,
            Long categoryId, Long brandId,
            BigDecimal price, BigDecimal discountPrice,
            Integer stockQuantity, Integer lowStockLimit,
            BigDecimal rating, String status, Boolean isFeatured,
            List<ImageDto> images, List<AttributeDto> attributes
    ) {}

    public record ProductSummary(
            Long id, String name, String slug,
            Long categoryId, Long brandId,
            BigDecimal price, BigDecimal discountPrice,
            BigDecimal rating, Integer stockQuantity, Boolean isFeatured,
            String imageUrl
    ) {}

    public record ProductRequest(
            @NotBlank String name,
            String slug,
            @NotBlank String sku,
            String description,
            String shortDescription,
            Long categoryId,
            Long brandId,
            @NotNull @PositiveOrZero BigDecimal price,
            BigDecimal discountPrice,
            @NotNull @PositiveOrZero Integer stockQuantity,
            Integer lowStockLimit,
            Boolean isFeatured,
            String status,
            List<String> imageUrls,
            List<AttributeDto> attributes
    ) {}

    public record CategoryResponse(
            Long id, String name, String slug, Long parentId, String imageUrl, String status
    ) {}

    public record CategoryRequest(
            @NotBlank String name,
            String slug,
            Long parentId,
            String imageUrl,
            String status
    ) {}

    public record BrandResponse(Long id, String name, String logoUrl, String status) {}
}
