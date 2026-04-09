package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.EscalationLevel;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketEscalationRequest {
    @NotNull(message = "Escalation level is required")
    private EscalationLevel escalationLevel;

    @NotNull(message = "Escalation reason is required")
    @Size(min = 10, max = 1000, message = "Escalation reason must be between 10 and 1000 characters")
    private String escalationReason;

    private Long escalatedTo;
    private LocalDateTime escalationDate;
    private Boolean notifyManagement = true;
    private String urgencyLevel;
    private String expectedResolution;
    private List<String> additionalRecipients;
}
