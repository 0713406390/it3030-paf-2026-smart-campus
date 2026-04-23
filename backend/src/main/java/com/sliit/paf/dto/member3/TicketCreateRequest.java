package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.TicketPriority;
import com.sliit.paf.model.member3.TicketType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class TicketCreateRequest {
    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotNull(message = "Ticket type is required")
    private TicketType type;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private Long facilityId;
    private Long roomId;
    private Long equipmentId;
    private List<String> tags;
}
