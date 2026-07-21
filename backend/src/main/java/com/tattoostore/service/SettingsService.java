package com.tattoostore.service;

import com.tattoostore.entity.StoreSetting;
import com.tattoostore.repository.StoreSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Editable store settings backed by the store_settings table. Keys that are not
 * set in the DB fall back to a code/ENV default, so the store works before an
 * admin ever opens the Settings page.
 */
@Service
@RequiredArgsConstructor
public class SettingsService {

    private final StoreSettingRepository repo;

    @Value("${app.store.default-delivery-fee}")
    private BigDecimal envDeliveryFee;

    @Value("${app.store.currency:EGP}")
    private String envCurrency;

    /** Keys exposed publicly (storefront) via GET /api/settings. */
    public static final java.util.List<String> PUBLIC_KEYS = java.util.List.of(
            "storeName", "currency", "deliveryFee", "freeDeliveryThreshold",
            "contactEmail", "contactPhone", "whatsapp", "address",
            "instagram", "facebook", "tiktok");

    @Transactional(readOnly = true)
    public String get(String key, String fallback) {
        return repo.findById(key).map(StoreSetting::getValue).filter(v -> v != null && !v.isBlank())
                .orElse(fallback);
    }

    @Transactional(readOnly = true)
    public BigDecimal getDeliveryFee() {
        try {
            String v = get("deliveryFee", null);
            return v == null ? envDeliveryFee : new BigDecimal(v);
        } catch (NumberFormatException e) {
            return envDeliveryFee;
        }
    }

    @Transactional(readOnly = true)
    public BigDecimal getFreeDeliveryThreshold() {
        try {
            String v = get("freeDeliveryThreshold", null);
            return v == null ? null : new BigDecimal(v);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** All settings merged over defaults — used by the admin Settings page. */
    @Transactional(readOnly = true)
    public Map<String, String> getAll() {
        Map<String, String> out = new LinkedHashMap<>();
        out.put("storeName", "Tattoo Store");
        out.put("currency", envCurrency);
        out.put("deliveryFee", envDeliveryFee.toPlainString());
        out.put("freeDeliveryThreshold", "");
        out.put("contactEmail", "");
        out.put("contactPhone", "");
        out.put("whatsapp", "");
        out.put("address", "");
        out.put("instagram", "");
        out.put("facebook", "");
        out.put("tiktok", "");
        for (StoreSetting s : repo.findAll()) {
            if (s.getValue() != null) out.put(s.getKey(), s.getValue());
        }
        return out;
    }

    @Transactional(readOnly = true)
    public Map<String, String> getPublic() {
        Map<String, String> all = getAll();
        Map<String, String> out = new LinkedHashMap<>();
        for (String k : PUBLIC_KEYS) out.put(k, all.getOrDefault(k, ""));
        return out;
    }

    @Transactional
    public Map<String, String> update(Map<String, String> values) {
        Instant now = Instant.now();
        values.forEach((k, v) -> {
            if (k == null || k.length() > 64) return;
            StoreSetting s = repo.findById(k).orElseGet(() ->
                    StoreSetting.builder().key(k).build());
            s.setValue(v);
            s.setUpdatedAt(now);
            repo.save(s);
        });
        return getAll();
    }
}
