package com.sliit.paf.dto.member4;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be 120 characters or less")
    private String name;

    @Size(max = 30, message = "Phone must be 30 characters or less")
    private String phone;

    @Size(max = 120, message = "Department must be 120 characters or less")
    private String department;

    @Size(max = 500, message = "Bio must be 500 characters or less")
    private String bio;
}
