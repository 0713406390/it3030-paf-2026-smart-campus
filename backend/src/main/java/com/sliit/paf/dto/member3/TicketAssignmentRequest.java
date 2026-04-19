package com.sliit.paf.dto.member3;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketAssignmentRequest {
    @NotNull(message = "Assignee ID is required")
    private Long assigneeId;

    @Size(max = 500, message = "Assignment notes cannot exceed 500 characters")
    private String assignmentNotes;

    private LocalDateTime assignedDate;
    private Boolean notifyAssignee = true;
    private Boolean notifyRequester = true;
    private String assignmentReason;
    private Long previousAssigneeId;
}
