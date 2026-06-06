package com.tattoostore.controller;

import com.tattoostore.dto.CatalogDtos.*;
import com.tattoostore.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Categories & Brands (public)")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/api/categories")
    public List<CategoryResponse> categories() {
        return categoryService.listCategories();
    }

    @GetMapping("/api/brands")
    public List<BrandResponse> brands() {
        return categoryService.listBrands();
    }
}
