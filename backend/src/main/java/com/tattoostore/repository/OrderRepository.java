package com.tattoostore.repository;

import com.tattoostore.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Order> findByOrderStatus(String orderStatus, Pageable pageable);
    List<Order> findByCreatedAtBetween(Instant from, Instant to);
    long countByOrderStatus(String orderStatus);
}
