package com.tattoostore.repository;

import com.tattoostore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByIsFeaturedTrueAndStatus(String status);
    List<Product> findTop8ByStatusOrderByCreatedAtDesc(String status);
    List<Product> findByStockQuantityLessThanEqual(Integer threshold);
    long countByStockQuantityLessThanEqual(Integer threshold);
}
