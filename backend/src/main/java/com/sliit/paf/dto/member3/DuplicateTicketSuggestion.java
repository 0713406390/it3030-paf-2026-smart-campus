package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DuplicateTicketSuggestion {
    private Long ticketId;
    private String title;
    private Ticket.TicketStatus status;
    private Ticket.TicketPriority priority;
    private Ticket.TicketCategory category;
    private LocalDateTime createdAt;
    private double similarityScore;
}