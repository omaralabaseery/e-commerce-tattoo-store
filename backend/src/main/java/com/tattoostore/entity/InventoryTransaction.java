package com.tattoostore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "inventory_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** STOCK_IN | STOCK_OUT | DAMAGED | RETURNED | ADJUSTMENT */
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer quantity;

    private String reason;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}
