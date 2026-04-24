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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AppUserRepository userRepository;

    public AuthController(AuthService authService,
                          AppUserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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
        response.put("phone", user.getPhone());
        response.put("department", user.getDepartment());
        response.put("bio", user.getBio());
        response.put("createdAt", user.getCreatedAt());
        response.put("updatedAt", user.getUpdatedAt());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }
}