package com.tattoostore.service;

import com.tattoostore.dto.AuthDtos.*;
import com.tattoostore.entity.RefreshToken;
import com.tattoostore.entity.Role;
import com.tattoostore.entity.User;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.RefreshTokenRepository;
import com.tattoostore.repository.RoleRepository;
import com.tattoostore.repository.UserRepository;
import com.tattoostore.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.refresh-token-ttl-days}")
    private long refreshTtlDays;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw ApiException.conflict("Email already registered");
        }
        Role role = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role missing"));
        User user = userRepository.save(User.builder()
                .name(req.name())
                .email(req.email())
                .phone(req.phone())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
                .status("ACTIVE")
                .build());
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid credentials"));
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        RefreshToken stored = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> ApiException.unauthorized("Invalid refresh token"));
        if (stored.getRevoked() || stored.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.unauthorized("Refresh token expired");
        }
        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);
        return issueTokens(user);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private AuthResponse issueTokens(User user) {
        String access = jwtService.generateAccessToken(user.getEmail(), Map.of(
                "uid", user.getId(),
                "role", user.getRole().getName()));
        String refresh = UUID.randomUUID().toString() + UUID.randomUUID();
        refreshTokenRepository.save(RefreshToken.builder()
                .userId(user.getId())
                .token(refresh)
                .expiresAt(Instant.now().plus(refreshTtlDays, ChronoUnit.DAYS))
                .revoked(false)
                .build());
        return new AuthResponse(access, refresh, "Bearer",
                new UserInfo(user.getId(), user.getName(), user.getEmail(), user.getRole().getName()));
    }
}
