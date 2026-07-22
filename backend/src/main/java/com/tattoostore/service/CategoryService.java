package com.tattoostore.service;

import com.tattoostore.dto.CatalogDtos.*;
import com.tattoostore.entity.Brand;
import com.tattoostore.entity.Category;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.BrandRepository;
import com.tattoostore.repository.CategoryRepository;
import com.tattoostore.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final TranslationService translationService;

    public List<CategoryResponse> listCategories(String lang) {
        return categoryRepository.findAll().stream()
                .map(c -> localize(toResponse(c), lang)).toList();
    }

    private CategoryResponse localize(CategoryResponse r, String lang) {
        if (lang == null || lang.isBlank()) return r;
        return new CategoryResponse(r.id(), translationService.translate(r.name(), lang),
                r.slug(), r.parentId(), r.imageUrl(), r.status());
    }

    public List<BrandResponse> listBrands() {
        return brandRepository.findAll().stream()
                .map(b -> new BrandResponse(b.getId(), b.getName(), b.getLogoUrl(), b.getStatus()))
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        Category c = new Category();
        apply(c, req);
        return toResponse(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Category not found"));
        apply(c, req);
        return toResponse(categoryRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) throw ApiException.notFound("Category not found");
        categoryRepository.deleteById(id);
    }

    private void apply(Category c, CategoryRequest req) {
        c.setName(req.name());
        c.setSlug((req.slug() == null || req.slug().isBlank()) ? SlugUtil.slugify(req.name()) : req.slug());
        c.setParentId(req.parentId());
        c.setImageUrl(req.imageUrl());
        if (req.status() != null) c.setStatus(req.status());
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(),
                c.getParentId(), c.getImageUrl(), c.getStatus());
    }
}
