package com.tattoostore.service;

import com.tattoostore.entity.TranslationCache;
import com.tattoostore.repository.TranslationCacheRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.translate.TranslateClient;
import software.amazon.awssdk.services.translate.model.TranslateTextRequest;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Set;

/**
 * Translates short catalog strings via Amazon Translate, caching every result
 * in the DB so identical text is never paid for twice. If AWS credentials are
 * not configured the service degrades gracefully — it just returns the original
 * text, so the store works with or without translation enabled.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class TranslationService {

    /** Languages the storefront offers. */
    public static final Set<String> SUPPORTED = Set.of("en", "ar");

    private final TranslationCacheRepository cacheRepository;

    @Value("${app.translate.region:eu-central-1}")
    private String region;

    private TranslateClient client;
    private boolean enabled;

    @PostConstruct
    void init() {
        try {
            // The default provider chain reads AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
            client = TranslateClient.builder().region(Region.of(region)).build();
            enabled = System.getenv("AWS_ACCESS_KEY_ID") != null
                    && !System.getenv("AWS_ACCESS_KEY_ID").isBlank();
            log.info("Amazon Translate {}", enabled ? "enabled (" + region + ")" : "disabled (no AWS credentials)");
        } catch (Exception e) {
            enabled = false;
            log.warn("Amazon Translate unavailable: {}", e.getMessage());
        }
    }

    /** Returns text translated into targetLang, or the original text on any miss/error. */
    @Transactional
    public String translate(String text, String targetLang) {
        if (text == null || text.isBlank() || targetLang == null) return text;
        String lang = targetLang.toLowerCase();
        if (!SUPPORTED.contains(lang)) return text;

        String key = cacheKey(text, lang);
        var cached = cacheRepository.findById(key).orElse(null);
        if (cached != null) return cached.getTranslatedText();

        if (!enabled) return text;
        try {
            String result = client.translateText(TranslateTextRequest.builder()
                    .sourceLanguageCode("auto")
                    .targetLanguageCode(lang)
                    .text(text)
                    .build()).translatedText();
            cacheRepository.save(TranslationCache.builder()
                    .cacheKey(key).translatedText(result).build());
            return result;
        } catch (Exception e) {
            log.debug("translate failed, returning original: {}", e.getMessage());
            return text;
        }
    }

    private String cacheKey(String text, String lang) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] h = md.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(64);
            for (byte b : h) sb.append(Character.forDigit((b >> 4) & 0xF, 16)).append(Character.forDigit(b & 0xF, 16));
            return sb.append(':').append(lang).toString();
        } catch (Exception e) {
            return Integer.toHexString(text.hashCode()) + ":" + lang;
        }
    }
}
