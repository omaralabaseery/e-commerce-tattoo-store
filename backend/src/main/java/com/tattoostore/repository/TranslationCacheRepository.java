package com.tattoostore.repository;

import com.tattoostore.entity.TranslationCache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TranslationCacheRepository extends JpaRepository<TranslationCache, String> {
}
