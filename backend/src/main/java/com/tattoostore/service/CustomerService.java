package com.tattoostore.service;

import com.tattoostore.dto.PageResponse;
import com.tattoostore.entity.Order;
import com.tattoostore.entity.User;
import com.tattoostore.repository.OrderRepository;
import com.tattoostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public record CustomerResponse(
            Long id, String name, String email, String phone, String status,
            Instant createdAt, long orderCount, BigDecimal totalSpent) {}

    public PageResponse<CustomerResponse> list(String search, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> users = (search == null || search.isBlank())
                ? userRepository.findByRole_Name("CUSTOMER", pr)
                : userRepository.searchByRole("CUSTOMER", search.trim(), pr);

        // aggregate order count + paid spend per customer (small store: one pass)
        Map<Long, long[]> counts = new HashMap<>();
        Map<Long, BigDecimal> spent = new HashMap<>();
        for (Order o : orderRepository.findAll()) {
            if (o.getUserId() == null) continue;
            counts.computeIfAbsent(o.getUserId(), k -> new long[1])[0]++;
            if ("PAID".equals(o.getPaymentStatus())) {
                spent.merge(o.getUserId(), o.getTotalAmount(), BigDecimal::add);
            }
        }

        return PageResponse.of(users.map(u -> new CustomerResponse(
                u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getStatus(),
                u.getCreatedAt(),
                counts.getOrDefault(u.getId(), new long[1])[0],
                spent.getOrDefault(u.getId(), BigDecimal.ZERO))));
    }
}
