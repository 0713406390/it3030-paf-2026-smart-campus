package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;

    @Size(max = 500, message = "Resolution notes cannot exceed 500 characters")
    private String resolutionNotes;

    private String resolutionCode;

    private Boolean notifyRequester = true;
}
