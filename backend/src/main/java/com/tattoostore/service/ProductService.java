package com.tattoostore.service;

import com.tattoostore.dto.CatalogDtos.*;
import com.tattoostore.dto.PageResponse;
import com.tattoostore.entity.Product;
import com.tattoostore.entity.ProductAttribute;
import com.tattoostore.entity.ProductImage;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.ProductRepository;
import com.tattoostore.util.SlugUtil;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// Class-level read-only transactions keep the Hibernate session open while
// toSummary/toResponse map the lazy images/attributes collections (open-in-view
// is disabled); mutating methods override this with their own @Transactional.
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    // ---------- Public catalog ----------

    public PageResponse<ProductSummary> list(Long categoryId, Long brandId,
                                             BigDecimal minPrice, BigDecimal maxPrice,
                                             Boolean inStock, BigDecimal minRating,
                                             String search, String sort,
                                             int page, int size) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            p.add(cb.equal(root.get("status"), "ACTIVE"));
            if (categoryId != null) p.add(cb.equal(root.get("categoryId"), categoryId));
            if (brandId != null) p.add(cb.equal(root.get("brandId"), brandId));
            if (minPrice != null) p.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) p.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            if (Boolean.TRUE.equals(inStock)) p.add(cb.greaterThan(root.get("stockQuantity"), 0));
            if (minRating != null) p.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                p.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("shortDescription")), like)));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };

        Sort sortBy = switch (sort == null ? "" : sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("isFeatured").descending().and(Sort.by("createdAt").descending());
        };

        Page<Product> result = productRepository.findAll(spec, PageRequest.of(page, size, sortBy));
        return PageResponse.of(result.map(this::toSummary));
    }

    public ProductResponse getBySlugOrId(String slugOrId) {
        Product product = resolve(slugOrId);
        return toResponse(product);
    }

    public List<ProductSummary> featured() {
        return productRepository.findByIsFeaturedTrueAndStatus("ACTIVE")
                .stream().map(this::toSummary).toList();
    }

    public List<ProductSummary> newArrivals() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc("ACTIVE")
                .stream().map(this::toSummary).toList();
    }

    // ---------- Admin ----------

    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product product = new Product();
        apply(product, req);
        return toResponse(productRepository.save(product), true);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        apply(product, req);
        return toResponse(productRepository.save(product), true);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) throw ApiException.notFound("Product not found");
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponse setStatus(Long id, String status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        product.setStatus(status);
        return toResponse(productRepository.save(product), true);
    }

    public PageResponse<ProductResponse> adminList(int page, int size) {
        return PageResponse.of(productRepository
                .findAll(PageRequest.of(page, size, Sort.by("id").descending()))
                .map(p -> toResponse(p, true)));
    }

    // ---------- mapping ----------

    private void apply(Product product, ProductRequest req) {
        product.setName(req.name());
        product.setSlug((req.slug() == null || req.slug().isBlank())
                ? SlugUtil.slugify(req.name()) : req.slug());
        product.setSku(req.sku());
        product.setDescription(req.description());
        product.setShortDescription(req.shortDescription());
        product.setCategoryId(req.categoryId());
        product.setBrandId(req.brandId());
        product.setPrice(req.price());
        product.setDiscountPrice(req.discountPrice());
        product.setWholesalePrice(req.wholesalePrice());
        product.setStockQuantity(req.stockQuantity());
        if (req.lowStockLimit() != null) product.setLowStockLimit(req.lowStockLimit());
        if (req.isFeatured() != null) product.setIsFeatured(req.isFeatured());
        if (req.status() != null) product.setStatus(req.status());

        product.getImages().clear();
        if (req.imageUrls() != null) {
            int i = 0;
            for (String url : req.imageUrls()) {
                product.getImages().add(ProductImage.builder().imageUrl(url).sortOrder(i++).build());
            }
        }
        product.getAttributes().clear();
        if (req.attributes() != null) {
            for (AttributeDto a : req.attributes()) {
                product.getAttributes().add(ProductAttribute.builder()
                        .attributeName(a.name()).attributeValue(a.value()).build());
            }
        }
    }

    private Product resolve(String slugOrId) {
        if (slugOrId.matches("\\d+")) {
            return productRepository.findById(Long.parseLong(slugOrId))
                    .orElseThrow(() -> ApiException.notFound("Product not found"));
        }
        return productRepository.findBySlug(slugOrId)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
    }

    private String primaryImage(Product p) {
        return p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl();
    }

    private ProductSummary toSummary(Product p) {
        return new ProductSummary(p.getId(), p.getName(), p.getSlug(),
                p.getCategoryId(), p.getBrandId(), p.getPrice(),
                p.getDiscountPrice(), p.getRating(), p.getStockQuantity(),
                p.getIsFeatured(), primaryImage(p));
    }

    /** Public mapping — wholesale price stays hidden. */
    private ProductResponse toResponse(Product p) {
        return toResponse(p, false);
    }

    private ProductResponse toResponse(Product p, boolean includeWholesale) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getSlug(), p.getSku(),
                p.getDescription(), p.getShortDescription(),
                p.getCategoryId(), p.getBrandId(),
                p.getPrice(), p.getDiscountPrice(),
                includeWholesale ? p.getWholesalePrice() : null,
                p.getStockQuantity(), p.getLowStockLimit(),
                p.getRating(), p.getStatus(), p.getIsFeatured(),
                p.getImages().stream().map(i -> new ImageDto(i.getId(), i.getImageUrl(), i.getSortOrder())).toList(),
                p.getAttributes().stream().map(a -> new AttributeDto(a.getAttributeName(), a.getAttributeValue())).toList());
    }
}
