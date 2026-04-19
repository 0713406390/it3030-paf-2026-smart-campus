package com.sliit.paf.service.member3;

import com.sliit.paf.dto.member3.TicketRequest;
import com.sliit.paf.dto.member3.TicketUpdateRequest;
import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketAttachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {
    Ticket createTicket(TicketRequest ticketRequest, Long reporterId);

    Ticket getTicketById(Long id);

    Page<Ticket> getAllTickets(Pageable pageable);

    Page<Ticket> getTicketsByReporter(Long reporterId, Pageable pageable);

    Page<Ticket> getMyTickets(Long reporterId, String username, boolean isAdmin, Pageable pageable);

    Page<Ticket> getTicketsByTechnician(Long technicianId, Pageable pageable);

    Page<Ticket> getTicketsByFilters(Ticket.TicketStatus status,
                                     Ticket.TicketCategory category,
                                     Ticket.TicketPriority priority,
                                     Pageable pageable);

    Ticket updateTicket(Long id, TicketUpdateRequest updateRequest, Long userId);

    Ticket assignTechnician(Long ticketId, Long technicianId);

    Ticket updateStatus(Long ticketId, Ticket.TicketStatus status, String notes, Long userId, boolean isAdmin);

    void deleteTicket(Long id);

    List<String> saveAttachments(Long ticketId, MultipartFile[] files);

    List<TicketAttachment> getAttachments(Long ticketId);

    TicketAttachment getAttachmentById(Long attachmentId);

    void deleteAttachment(Long attachmentId, Long userId);
}
