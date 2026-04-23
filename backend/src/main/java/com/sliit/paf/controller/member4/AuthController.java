package com.sliit.paf.controller.member4;

import com.sliit.paf.dto.member4.AuthResponse;
import com.sliit.paf.dto.member4.LoginRequest;
import com.sliit.paf.dto.member4.RegisterRequest;
import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.repository.member4.AppUserRepository;
import com.sliit.paf.security.member4.UserPrincipal;
import com.sliit.paf.service.member4.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthController(AuthService authService, AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AppUser user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("enabled", user.isEnabled());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/forgot-password
     * Generates a reset token for the given email.
     * Body: { "email": "..." }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        AppUser user = userRepository.findByEmail(email).orElse(null);

        // Always return success to prevent email enumeration
        if (user == null) {
            return ResponseEntity.ok(Map.of(
                "message", "If that email exists, a reset link has been sent."
            ));
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // In production: send email with reset link
        // For demo purposes, token is returned so it can be tested
        return ResponseEntity.ok(Map.of(
            "message", "Password reset link sent to " + email,
            "resetToken", token   // remove this in production
        ));
    }

    /**
     * POST /api/auth/reset-password
     * Resets the password using the token.
     * Body: { "token": "...", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Password must be at least 6 characters"));
        }

        AppUser user = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getResetToken()))
            .findFirst()
            .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid or expired reset token"));
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Reset token has expired. Please request a new one."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
    }

}