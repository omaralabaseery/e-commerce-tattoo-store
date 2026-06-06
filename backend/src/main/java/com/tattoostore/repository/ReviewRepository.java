package com.tattoostore.repository;

import com.tattoostore.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndStatus(Long productId, String status);
}
