package com.tattoostore.security;

import com.tattoostore.entity.User;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

/** Resolves the authenticated user from the security context. */
@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepository;

    public Optional<User> findOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserDetails ud)) {
            return Optional.empty();
        }
        return userRepository.findByEmail(ud.getUsername());
    }

    public User require() {
        return findOptional().orElseThrow(() -> ApiException.unauthorized("Authentication required"));
    }

    public Long requireId() {
        return require().getId();
    }
}
