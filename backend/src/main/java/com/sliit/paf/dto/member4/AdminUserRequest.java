package com.sliit.paf.dto.member4;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUserRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be 120 characters or less")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Validated manually: required on create, optional on update (blank = keep existing)
    private String password;

    private String role; // USER, TECHNICIAN, ADMIN

    @Size(max = 30, message = "Phone must be 30 characters or less")
    private String phone;

    @Size(max = 120, message = "Department must be 120 characters or less")
    private String department;

    @Size(max = 500, message = "Bio must be 500 characters or less")
    private String bio;

    private Boolean enabled;
}
