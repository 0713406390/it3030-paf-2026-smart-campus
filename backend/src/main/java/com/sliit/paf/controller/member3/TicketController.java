package com.sliit.paf.controller.member3;

import com.sliit.paf.dto.member3.TicketRequest;
import com.sliit.paf.dto.member3.TicketUpdateRequest;
import com.sliit.paf.model.member3.TicketAttachment;
import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.UserRepository;
import com.sliit.paf.service.FileStorageService;
import com.sliit.paf.service.member3.TicketService;
import org.springframework.core.io.Resource;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    
    private final TicketService ticketService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @Autowired
    public TicketController(TicketService ticketService, UserRepository userRepository, FileStorageService fileStorageService) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest ticketRequest,
                                             @AuthenticationPrincipal UserDetails currentUser) {
        // Extract user ID from current user (implementation depends on your auth setup)
        Long userId = getUserIdFromCurrentUser(currentUser);
        
        Ticket ticket = ticketService.createTicket(ticketRequest, userId);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Ticket>> getAllTickets(Pageable pageable) {
        Page<Ticket> tickets = ticketService.getAllTickets(pageable);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/my-tickets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Ticket>> getMyTickets(Pageable pageable,
                                                    @AuthenticationPrincipal UserDetails currentUser) {
        Long userId = getUserIdFromCurrentUser(currentUser);
        String username = (currentUser != null && currentUser.getUsername() != null)
            ? currentUser.getUsername()
            : "system-user";
        boolean isAdmin = currentUser != null && currentUser.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));

        Page<Ticket> tickets = ticketService.getMyTickets(userId, username, isAdmin, pageable);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/assigned-to-me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Ticket>> getAssignedTickets(Pageable pageable,
                                                         @AuthenticationPrincipal UserDetails currentUser) {
        Long userId = getUserIdFromCurrentUser(currentUser);
        Page<Ticket> tickets = ticketService.getTicketsByTechnician(userId, pageable);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Ticket>> getTicketsByFilters(
            @RequestParam(required = false) Ticket.TicketStatus status,
            @RequestParam(required = false) Ticket.TicketCategory category,
            @RequestParam(required = false) Ticket.TicketPriority priority,
            Pageable pageable) {
        
        Page<Ticket> tickets = ticketService.getTicketsByFilters(status, category, priority, pageable);
        return ResponseEntity.ok(tickets);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id,
                                             @Valid @RequestBody TicketUpdateRequest updateRequest,
                                             @AuthenticationPrincipal UserDetails currentUser) {
        Long userId = getUserIdFromCurrentUser(currentUser);
        Ticket ticket = ticketService.updateTicket(id, updateRequest, userId);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> assignTechnician(@PathVariable Long id,
                                                  @RequestParam Long technicianId) {
        Ticket ticket = ticketService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable Long id,
                                                    @RequestParam Ticket.TicketStatus status,
                                                    @RequestParam(required = false) String notes,
                                                    @AuthenticationPrincipal UserDetails currentUser) {
        Long userId = getUserIdFromCurrentUser(currentUser);
        boolean isAdmin = currentUser != null && currentUser.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        Ticket ticket = ticketService.updateStatus(id, status, notes, userId, isAdmin);
        return ResponseEntity.ok(ticket);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadAttachments(@PathVariable Long id,
                                                         @RequestParam("files") MultipartFile[] files,
                                                         @AuthenticationPrincipal UserDetails currentUser) {
        // Verify the user is the ticket reporter
        Ticket ticket = ticketService.getTicketById(id);
        Long userId = getUserIdFromCurrentUser(currentUser);
        boolean isAdmin = currentUser != null && currentUser.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        
        if (!isAdmin && !ticket.getReporter().getId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        
        List<String> fileNames = ticketService.saveAttachments(id, files);
        return ResponseEntity.ok(fileNames);
    }

    @GetMapping("/{id}/attachments")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<List<TicketAttachment>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAttachments(id));
    }
    
    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId,
                                               @AuthenticationPrincipal UserDetails currentUser) {
        Long userId = getUserIdFromCurrentUser(currentUser);
        ticketService.deleteAttachment(attachmentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attachments/{attachmentId}/view")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<Resource> viewAttachment(@PathVariable Long attachmentId) {
        TicketAttachment attachment = ticketService.getAttachmentById(attachmentId);
        Resource resource = fileStorageService.loadFileAsResource(attachment.getFilePath());

        MediaType mediaType;
        try {
            mediaType = attachment.getContentType() != null
                    ? MediaType.parseMediaType(attachment.getContentType())
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception ignored) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header("Content-Disposition", "inline; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }
    
    // Resolve authenticated principal to a persisted user row so ticket submissions always have a valid reporter.
    private Long getUserIdFromCurrentUser(UserDetails currentUser) {
        String username = (currentUser != null && currentUser.getUsername() != null && !currentUser.getUsername().isBlank())
                ? currentUser.getUsername()
                : "system-user";

        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseGet(() -> {
                    User user = new User();
                    user.setUsername(username);
                    user.setName(username);
                    return userRepository.save(user).getId();
                });
    }
}