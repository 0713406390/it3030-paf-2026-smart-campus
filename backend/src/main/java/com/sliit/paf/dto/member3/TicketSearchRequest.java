package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.TicketPriority;
import com.sliit.paf.model.member3.TicketStatus;
import com.sliit.paf.model.member3.TicketType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketSearchRequest {
    private String keyword;
    private List<TicketStatus> statuses;
    private List<TicketType> types;
    private List<TicketPriority> priorities;
    private Long assignedTo;
    private Long requestedBy;
    private Long facilityId;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private Boolean isOverdue;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
    private int page = 0;
    private int size = 20;
}
