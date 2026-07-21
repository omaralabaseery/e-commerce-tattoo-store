package com.tattoostore.repository;

import com.tattoostore.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByRole_Name(String roleName, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("""
            select u from User u where u.role.name = :role and (
                lower(u.name) like lower(concat('%', :q, '%'))
                or lower(u.email) like lower(concat('%', :q, '%'))
                or u.phone like concat('%', :q, '%'))
            """)
    Page<User> searchByRole(@org.springframework.data.repository.query.Param("role") String role,
                            @org.springframework.data.repository.query.Param("q") String q,
                            Pageable pageable);
}
