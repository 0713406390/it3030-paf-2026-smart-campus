package com.sliit.paf.controller.member4;

import com.sliit.paf.dto.member4.AdminUserRequest;
import com.sliit.paf.dto.member4.UserSummaryResponse;
import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.model.member4.Role;
import com.sliit.paf.repository.member4.AppUserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers(
            @RequestParam(required = false) String role) {
        List<AppUser> users = role != null
                ? userRepository.findByRole(Role.valueOf(role.toUpperCase()))
                : userRepository.findAll();
        return ResponseEntity.ok(users.stream().map(UserSummaryResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSummaryResponse> getUserById(@PathVariable Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(UserSummaryResponse.from(user));
    }

    @PostMapping
    public ResponseEntity<UserSummaryResponse> createUser(@Valid @RequestBody AdminUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required when creating a user");
        }
        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        Role role = parseRole(request.getRole(), Role.USER);

        AppUser user = AppUser.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(request.getEnabled() != null ? request.getEnabled() : true)
                .phone(normalize(request.getPhone()))
                .department(normalize(request.getDepartment()))
                .bio(normalize(request.getBio()))
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(UserSummaryResponse.from(userRepository.save(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSummaryResponse> updateUser(
            @PathVariable Long id, @Valid @RequestBody AdminUserRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already taken: " + newEmail);
        }

        user.setName(request.getName().trim());
        user.setEmail(newEmail);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 6) {
                throw new RuntimeException("Password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(parseRole(request.getRole(), user.getRole()));
        }

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        user.setPhone(normalize(request.getPhone()));
        user.setDepartment(normalize(request.getDepartment()));
        user.setBio(normalize(request.getBio()));

        return ResponseEntity.ok(UserSummaryResponse.from(userRepository.save(user)));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserSummaryResponse> updateRole(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRole(Role.valueOf(body.get("role").toUpperCase()));
        return ResponseEntity.ok(UserSummaryResponse.from(userRepository.save(user)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserSummaryResponse> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setEnabled(body.get("enabled"));
        return ResponseEntity.ok(UserSummaryResponse.from(userRepository.save(user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Role parseRole(String roleStr, Role fallback) {
        if (roleStr == null || roleStr.isBlank()) return fallback;
        try {
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleStr);
        }
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
