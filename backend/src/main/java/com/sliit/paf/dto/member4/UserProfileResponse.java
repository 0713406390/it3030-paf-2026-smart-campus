package com.sliit.paf.dto.member4;

import com.sliit.paf.model.member4.AppUser;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;
    private String phone;
    private String department;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserProfileResponse from(AppUser user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.isEnabled());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
