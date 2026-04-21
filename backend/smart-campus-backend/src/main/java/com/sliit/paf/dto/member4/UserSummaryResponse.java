package com.sliit.paf.dto.member4;

import com.sliit.paf.model.member4.AppUser;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;

    public static UserSummaryResponse from(AppUser user) {
        UserSummaryResponse dto = new UserSummaryResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}