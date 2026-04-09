package com.sliit.paf.dto.member3;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AttachmentUploadRequest {
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name cannot exceed 255 characters")
    private String fileName;

    @NotBlank(message = "File content is required")
    private String fileContent;

    @NotBlank(message = "Content type is required")
    private String contentType;

    private Long fileSize;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private Boolean isPublic = true;
}
