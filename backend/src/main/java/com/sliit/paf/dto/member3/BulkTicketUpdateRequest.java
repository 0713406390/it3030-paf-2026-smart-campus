package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.TicketPriority;
import com.sliit.paf.model.member3.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BulkTicketUpdateRequest {
    @NotEmpty(message = "Ticket IDs cannot be empty")
    private List<Long> ticketIds;

    private TicketStatus status;
    private TicketPriority priority;
    private Long assignedTo;
    private List<String> tagsToAdd;
    private List<String> tagsToRemove;
    @NotBlank(message = "Update reason is required")
    private String updateReason;
    private Boolean notifyUsers = true;
    private String bulkComment;
}
