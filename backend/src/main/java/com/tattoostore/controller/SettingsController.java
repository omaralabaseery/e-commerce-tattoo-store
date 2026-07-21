package com.tattoostore.controller;

import com.tattoostore.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Settings")
public class SettingsController {

    private final SettingsService settingsService;

    /** Public subset used by the storefront (store name, currency, contact, socials). */
    @GetMapping("/api/settings")
    public Map<String, String> publicSettings() {
        return settingsService.getPublic();
    }

    @GetMapping("/api/admin/settings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public Map<String, String> all() {
        return settingsService.getAll();
    }

    @PutMapping("/api/admin/settings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public Map<String, String> update(@RequestBody Map<String, String> body) {
        return settingsService.update(body);
    }
}
