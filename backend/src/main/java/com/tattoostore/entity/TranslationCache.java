package com.tattoostore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "translation_cache")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TranslationCache {

    @Id
    @Column(name = "cache_key", length = 80)
    private String cacheKey;

    @Column(name = "translated_text", nullable = false, columnDefinition = "text")
    private String translatedText;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
