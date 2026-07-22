package com.tattoostore.controller;

import com.tattoostore.dto.CatalogDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products (public)")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductSummary> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return productService.list(categoryId, brandId, minPrice, maxPrice,
                inStock, minRating, search, sort, page, size, lang);
    }

    @GetMapping("/featured")
    public List<ProductSummary> featured(@RequestParam(required = false) String lang) {
        return productService.featured(lang);
    }

    @GetMapping("/new-arrivals")
    public List<ProductSummary> newArrivals(@RequestParam(required = false) String lang) {
        return productService.newArrivals(lang);
    }

    @GetMapping("/{slugOrId}")
    public ProductResponse get(@PathVariable String slugOrId,
                               @RequestParam(required = false) String lang) {
        return productService.getBySlugOrId(slugOrId, lang);
    }
}
