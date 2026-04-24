package com.sliit.paf.dto.member3;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class TicketAttachmentRequest {
    @NotNull(message = "Attachment file is required")
    private MultipartFile file;

    @NotBlank(message = "Attachment description is required")
    private String description;

    private Boolean isPublic = true;
}
