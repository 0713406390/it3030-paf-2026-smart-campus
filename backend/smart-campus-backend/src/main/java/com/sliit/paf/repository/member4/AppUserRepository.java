package com.sliit.paf.repository.member4;

import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.model.member4.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Member 4 - AppUser Repository
 * Handles all database queries for users.
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    List<AppUser> findByRole(Role role);
}