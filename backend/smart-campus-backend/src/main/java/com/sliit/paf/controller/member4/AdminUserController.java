package com.sliit.paf.controller.member4;

import com.sliit.paf.dto.member4.UserSummaryResponse;
import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.model.member4.Role;
import com.sliit.paf.repository.member4.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AppUserRepository userRepository;

    public AdminUserController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/admin/users
    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers(
            @RequestParam(required = false) String role) {
        List<AppUser> users;
        if (role != null) {
            users = userRepository.findByRole(Role.valueOf(role.toUpperCase()));
        } else {
            users = userRepository.findAll();
        }
        return ResponseEntity.ok(
            users.stream().map(UserSummaryResponse::from).collect(Collectors.toList())
        );
    }

    // GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserSummaryResponse> getUserById(@PathVariable Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(UserSummaryResponse.from(user));
    }

    // PUT /api/admin/users/{id}/role
    @PutMapping("/{id}/role")
    public ResponseEntity<UserSummaryResponse> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRole(Role.valueOf(body.get("role").toUpperCase()));
        return ResponseEntity.ok(UserSummaryResponse.from(userRepository.save(user)));
    }

    // PATCH /api/admin/users/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserSummaryResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setEnabled(body.get("enabled"));
        return ResponseEntity.ok(UserSummaryResponse.from(userRepository.save(user)));
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}