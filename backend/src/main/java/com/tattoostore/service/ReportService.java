package com.tattoostore.service;

import com.tattoostore.entity.Order;
import com.tattoostore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /** Dashboard overview cards. */
    public Map<String, Object> overview() {
        List<Order> all = orderRepository.findAll();
        BigDecimal revenue = all.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStock = productRepository.countByStockQuantityLessThanEqual(5);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalSales", revenue);
        data.put("totalOrders", all.size());
        data.put("totalCustomers", userRepository.count());
        data.put("totalProducts", productRepository.count());
        data.put("pendingOrders", orderRepository.countByOrderStatus("PENDING"));
        data.put("lowStockCount", lowStock);
        return data;
    }

    /** Daily revenue for the last N days. */
    public Map<String, Object> sales(int days) {
        Instant from = Instant.now().minus(days, ChronoUnit.DAYS);
        List<Order> orders = orderRepository.findByCreatedAtBetween(from, Instant.now());
        Map<String, BigDecimal> byDay = new TreeMap<>();
        for (Order o : orders) {
            if (!"PAID".equals(o.getPaymentStatus())) continue;
            LocalDate d = o.getCreatedAt().atZone(ZoneId.of("UTC")).toLocalDate();
            byDay.merge(d.toString(), o.getTotalAmount(), BigDecimal::add);
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("series", byDay);
        data.put("days", days);
        return data;
    }

    public Map<String, Object> ordersByStatus() {
        Map<String, Object> data = new LinkedHashMap<>();
        for (String s : List.of("PENDING", "CONFIRMED", "PROCESSING",
                "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED")) {
            data.put(s, orderRepository.countByOrderStatus(s));
        }
        return data;
    }

    public Map<String, Object> inventory() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("lowStock", productRepository.findByStockQuantityLessThanEqual(5).stream()
                .map(p -> Map.of("id", p.getId(), "name", p.getName(),
                        "stock", p.getStockQuantity(), "limit", p.getLowStockLimit()))
                .toList());
        return data;
    }
}
