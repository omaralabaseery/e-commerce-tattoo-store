package com.tattoostore.config;

import com.tattoostore.entity.Role;
import com.tattoostore.entity.User;
import com.tattoostore.repository.RoleRepository;
import com.tattoostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default users with properly hashed passwords (reference data lives in Flyway).
 * Idempotent: only creates a user if the email is not already present.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("Store Admin", "admin@tattoostore.com", "Admin@12345", "SUPER_ADMIN", "99000000");
        seedUser("Sample Customer", "customer@example.com", "Customer@12345", "CUSTOMER", "99111111");
    }

    private void seedUser(String name, String email, String rawPassword, String roleName, String phone) {
        if (userRepository.existsByEmail(email)) return;
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role: " + roleName));
        userRepository.save(User.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .status("ACTIVE")
                .build());
    }
}
