package com.sliit.paf.controller.member4;

import com.sliit.paf.dto.member4.UpdateProfileRequest;
import com.sliit.paf.dto.member4.UserProfileResponse;
import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.repository.member4.AppUserRepository;
import com.sliit.paf.security.member4.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/profile")
public class UserProfileController {

    private final AppUserRepository userRepository;

    public UserProfileController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AppUser user = findCurrentUser(currentUser);
        return ResponseEntity.ok(UserProfileResponse.from(user));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        AppUser user = findCurrentUser(currentUser);

        user.setName(request.getName().trim());
        user.setPhone(normalize(request.getPhone()));
        user.setDepartment(normalize(request.getDepartment()));
        user.setBio(normalize(request.getBio()));

        AppUser saved = userRepository.save(user);
        return ResponseEntity.ok(UserProfileResponse.from(saved));
    }

    private AppUser findCurrentUser(UserPrincipal currentUser) {
        return userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
