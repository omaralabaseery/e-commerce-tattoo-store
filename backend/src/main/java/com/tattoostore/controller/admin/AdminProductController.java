package com.tattoostore.controller.admin;

import com.tattoostore.dto.CatalogDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin · Products")
@PreAuthorize("hasAuthority('PRODUCT_MANAGE')")
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return productService.adminList(page, size);
    }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody ProductRequest req) {
        return productService.create(req);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return productService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ProductResponse setStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return productService.setStatus(id, body.getOrDefault("status", "ACTIVE"));
    }
}
