package com.sliit.paf.service.member3.Impl.member3;

import com.sliit.paf.dto.member3.TicketRequest;
import com.sliit.paf.dto.member3.TicketUpdateRequest;
import com.sliit.paf.exception.ResourceNotFoundException;
import com.sliit.paf.exception.UnauthorizedException;
import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketAttachment;
import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.TicketAttachmentRepository;
import com.sliit.paf.repository.member3.TicketRepository;
import com.sliit.paf.repository.member3.UserRepository;
import com.sliit.paf.service.FileStorageService;
import com.sliit.paf.service.member3.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             UserRepository userRepository,
                             TicketAttachmentRepository attachmentRepository,
                             FileStorageService fileStorageService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.attachmentRepository = attachmentRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public Ticket createTicket(TicketRequest ticketRequest, Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reporterId));

        validateRequestRules(ticketRequest);

        Ticket ticket = new Ticket();
        ticket.setTitle(ticketRequest.getTitle());
        ticket.setDescription(ticketRequest.getDescription());
        ticket.setCategory(resolveCategory(ticketRequest.getRequestType(), ticketRequest.getCategory()));
        ticket.setPriority(ticketRequest.getPriority());
        ticket.setLocation(ticketRequest.getLocation());
        ticket.setContactInfo(ticketRequest.getContactInfo());
        ticket.setRequesterName(ticketRequest.getRequesterName());
        ticket.setRequesterEmail(ticketRequest.getRequesterEmail());
        ticket.setRegistrationNumber(ticketRequest.getRegistrationNumber());
        ticket.setRequesterType(ticketRequest.getRequesterType());
        ticket.setContactNumber(ticketRequest.getContactNumber());
        ticket.setFacultyOrSchool(ticketRequest.getFacultyOrSchool());
        ticket.setRequestType(ticketRequest.getRequestType());
        ticket.setOfficialDocumentType(ticketRequest.getOfficialDocumentType());
        ticket.setAcademicYear(ticketRequest.getAcademicYear());
        ticket.setAcademicSemester(ticketRequest.getAcademicSemester());
        ticket.setProgramme(ticketRequest.getProgramme());
        ticket.setRegistrationType(ticketRequest.getRegistrationType());
        ticket.setBuildingNumber(ticketRequest.getBuildingNumber());
        ticket.setRoomNumber(ticketRequest.getRoomNumber());
        ticket.setItemNumber(ticketRequest.getItemNumber());
        ticket.setIncidentDescription(ticketRequest.getIncidentDescription());
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        ticket.setReporter(reporter);
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
    }

    @Override
    public Page<Ticket> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }

    @Override
    public Page<Ticket> getTicketsByReporter(Long reporterId, Pageable pageable) {
        return ticketRepository.findByReporterId(reporterId, pageable);
    }

    @Override
    public Page<Ticket> getMyTickets(Long reporterId, String username, boolean isAdmin, Pageable pageable) {
        if (isAdmin) {
            return ticketRepository.findByReporterId(reporterId, pageable);
        }

        // Backward compatibility: older tickets were created while frontend defaulted to admin credentials.
        return ticketRepository.findByReporterIdOrReporterUsername(reporterId, "admin", pageable);
    }

    @Override
    public Page<Ticket> getTicketsByTechnician(Long technicianId, Pageable pageable) {
        return ticketRepository.findByAssignedTechnicianId(technicianId, pageable);
    }

    @Override
    public Page<Ticket> getTicketsByFilters(Ticket.TicketStatus status, Ticket.TicketCategory category, Ticket.TicketPriority priority, Pageable pageable) {
        return ticketRepository.findByFilters(status, category, priority, pageable);
    }

    @Override
    @Transactional
    public Ticket updateTicket(Long id, TicketUpdateRequest updateRequest, Long userId) {
        Ticket ticket = getTicketById(id);

        if (!ticket.getReporter().getId().equals(userId) &&
                (ticket.getAssignedTechnician() == null || !ticket.getAssignedTechnician().getId().equals(userId))) {
            throw new UnauthorizedException("You are not authorized to update this ticket");
        }

        if (StringUtils.hasText(updateRequest.getTitle())) {
            ticket.setTitle(updateRequest.getTitle());
        }
        if (StringUtils.hasText(updateRequest.getDescription())) {
            ticket.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getRequestType() != null) {
            ticket.setRequestType(updateRequest.getRequestType());
            ticket.setCategory(resolveCategory(updateRequest.getRequestType(), updateRequest.getCategory()));
        } else if (updateRequest.getCategory() != null) {
            ticket.setCategory(updateRequest.getCategory());
        }
        if (updateRequest.getPriority() != null) {
            ticket.setPriority(updateRequest.getPriority());
        }
        if (StringUtils.hasText(updateRequest.getLocation())) {
            ticket.setLocation(updateRequest.getLocation());
        }
        if (StringUtils.hasText(updateRequest.getContactInfo())) {
            ticket.setContactInfo(updateRequest.getContactInfo());
        }

        if (StringUtils.hasText(updateRequest.getRequesterName())) {
            ticket.setRequesterName(updateRequest.getRequesterName());
        }
        if (StringUtils.hasText(updateRequest.getRequesterEmail())) {
            ticket.setRequesterEmail(updateRequest.getRequesterEmail());
        }
        if (StringUtils.hasText(updateRequest.getRegistrationNumber())) {
            ticket.setRegistrationNumber(updateRequest.getRegistrationNumber());
        }
        if (updateRequest.getRequesterType() != null) {
            ticket.setRequesterType(updateRequest.getRequesterType());
        }
        if (StringUtils.hasText(updateRequest.getContactNumber())) {
            ticket.setContactNumber(updateRequest.getContactNumber());
        }
        if (updateRequest.getFacultyOrSchool() != null) {
            ticket.setFacultyOrSchool(updateRequest.getFacultyOrSchool());
        }
        if (updateRequest.getOfficialDocumentType() != null) {
            ticket.setOfficialDocumentType(updateRequest.getOfficialDocumentType());
        }
        if (StringUtils.hasText(updateRequest.getAcademicYear())) {
            ticket.setAcademicYear(updateRequest.getAcademicYear());
        }
        if (StringUtils.hasText(updateRequest.getAcademicSemester())) {
            ticket.setAcademicSemester(updateRequest.getAcademicSemester());
        }
        if (StringUtils.hasText(updateRequest.getProgramme())) {
            ticket.setProgramme(updateRequest.getProgramme());
        }
        if (updateRequest.getRegistrationType() != null) {
            ticket.setRegistrationType(updateRequest.getRegistrationType());
        }
        if (StringUtils.hasText(updateRequest.getBuildingNumber())) {
            ticket.setBuildingNumber(updateRequest.getBuildingNumber());
        }
        if (StringUtils.hasText(updateRequest.getRoomNumber())) {
            ticket.setRoomNumber(updateRequest.getRoomNumber());
        }
        if (StringUtils.hasText(updateRequest.getItemNumber())) {
            ticket.setItemNumber(updateRequest.getItemNumber());
        }
        if (StringUtils.hasText(updateRequest.getIncidentDescription())) {
            ticket.setIncidentDescription(updateRequest.getIncidentDescription());
        }

        validateUpdateRules(ticket);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", technicianId));

        if (ticket.getStatus() == Ticket.TicketStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot assign a technician to a rejected ticket");
        }

        ticket.setAssignedTechnician(technician);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (ticket.getStatus() == Ticket.TicketStatus.OPEN) {
            ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        }

        return ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public Ticket updateStatus(Long ticketId, Ticket.TicketStatus status, String notes, Long userId, boolean isAdmin) {
        Ticket ticket = getTicketById(ticketId);

        if (!isAdmin && (ticket.getAssignedTechnician() == null || !ticket.getAssignedTechnician().getId().equals(userId))) {
            throw new UnauthorizedException("Only the assigned technician can update the ticket status");
        }

        if (!isAdmin) {
            if (status == Ticket.TicketStatus.REJECTED || status == Ticket.TicketStatus.CLOSED || status == Ticket.TicketStatus.OPEN) {
                throw new UnauthorizedException("Only admins can set this status");
            }
        }

        if (!isValidStatusTransition(ticket.getStatus(), status, isAdmin)) {
            throw new IllegalArgumentException("Invalid status transition: " + ticket.getStatus() + " -> " + status);
        }

        if ((status == Ticket.TicketStatus.RESOLVED || status == Ticket.TicketStatus.REJECTED) && !StringUtils.hasText(notes)) {
            throw new IllegalArgumentException(
                    status == Ticket.TicketStatus.REJECTED
                            ? "A rejection reason is required when rejecting a ticket"
                            : "Resolution notes are required when resolving a ticket"
            );
        }

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (status == Ticket.TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(notes);
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (status == Ticket.TicketStatus.REJECTED) {
            ticket.setRejectionReason(notes);
        }

        return ticketRepository.save(ticket);
    }

    private boolean isValidStatusTransition(Ticket.TicketStatus currentStatus,
                                            Ticket.TicketStatus targetStatus,
                                            boolean isAdmin) {
        if (currentStatus == targetStatus) {
            return true;
        }

        if (isAdmin) {
            return true;
        }

        return switch (currentStatus) {
            case OPEN -> targetStatus == Ticket.TicketStatus.IN_PROGRESS;
            case IN_PROGRESS -> targetStatus == Ticket.TicketStatus.RESOLVED;
            case RESOLVED, CLOSED, REJECTED -> false;
        };
    }

    @Override
    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }

    @Override
    @Transactional
    public List<String> saveAttachments(Long ticketId, MultipartFile[] files) {
        Ticket ticket = getTicketById(ticketId);

        long existing = attachmentRepository.countByTicketId(ticketId);
        long incoming = 0;
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                incoming++;
            }
        }

        if (existing + incoming > 3) {
            throw new RuntimeException("Maximum number of attachments (3) reached");
        }

        List<String> fileNames = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String fileName = fileStorageService.storeFile(file);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFilePath(fileName);
            attachment.setContentType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setTicket(ticket);
            attachment.setUploadedAt(LocalDateTime.now());

            attachmentRepository.save(attachment);
            fileNames.add(fileName);
        }

        return fileNames;
    }

    @Override
    public List<TicketAttachment> getAttachments(Long ticketId) {
        getTicketById(ticketId);
        return attachmentRepository.findByTicketId(ticketId);
    }

    @Override
    public TicketAttachment getAttachmentById(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId, Long userId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        if (!attachment.getTicket().getReporter().getId().equals(userId)) {
            throw new UnauthorizedException("Only the ticket reporter can delete attachments");
        }

        fileStorageService.deleteFile(attachment.getFilePath());
        attachmentRepository.delete(attachment);
    }

    private Ticket.TicketCategory resolveCategory(Ticket.RequestType requestType, Ticket.TicketCategory requestedCategory) {
        if (requestType == null) {
            return requestedCategory != null ? requestedCategory : Ticket.TicketCategory.OTHER;
        }

        return switch (requestType) {
            case INFORM_EQUIPMENT_FAILURE -> Ticket.TicketCategory.EQUIPMENT_FAILURE;
            case INFORM_FACILITY_ISSUE -> Ticket.TicketCategory.FACILITY_ISSUE;
            case INFORM_SOFTWARE_PROBLEM -> Ticket.TicketCategory.SOFTWARE_PROBLEM;
            case INFORM_NETWORK_ISSUE -> Ticket.TicketCategory.NETWORK_ISSUE;
            default -> Ticket.TicketCategory.OTHER;
        };
    }

    private void validateRequestRules(TicketRequest request) {
        if (request.getRequestType() == Ticket.RequestType.REQUEST_OFFICIAL_DOCUMENT && request.getOfficialDocumentType() == null) {
            throw new IllegalArgumentException("Official document type is required for official document requests");
        }

        if (request.getRequestType() == Ticket.RequestType.QUESTION_ABOUT_REGISTRATION) {
            if (!StringUtils.hasText(request.getAcademicYear()) ||
                    !StringUtils.hasText(request.getAcademicSemester()) ||
                    !StringUtils.hasText(request.getProgramme()) ||
                    request.getRegistrationType() == null) {
                throw new IllegalArgumentException("Registration questions require academic year, semester, programme, and registration type");
            }
        }

        if (request.getRequestType() == Ticket.RequestType.INFORM_EQUIPMENT_FAILURE ||
                request.getRequestType() == Ticket.RequestType.INFORM_FACILITY_ISSUE ||
                request.getRequestType() == Ticket.RequestType.INFORM_SOFTWARE_PROBLEM ||
                request.getRequestType() == Ticket.RequestType.INFORM_NETWORK_ISSUE) {
            if (!StringUtils.hasText(request.getBuildingNumber()) ||
                    !StringUtils.hasText(request.getRoomNumber()) ||
                    !StringUtils.hasText(request.getItemNumber()) ||
                    !StringUtils.hasText(request.getIncidentDescription())) {
                throw new IllegalArgumentException("Incident requests require building number, room number, item number, and incident description");
            }
        }
    }

    private void validateUpdateRules(Ticket ticket) {
        if (ticket.getRequestType() == Ticket.RequestType.REQUEST_OFFICIAL_DOCUMENT && ticket.getOfficialDocumentType() == null) {
            throw new IllegalArgumentException("Official document type is required for official document requests");
        }

        if (ticket.getRequestType() == Ticket.RequestType.QUESTION_ABOUT_REGISTRATION) {
            if (!StringUtils.hasText(ticket.getAcademicYear()) ||
                    !StringUtils.hasText(ticket.getAcademicSemester()) ||
                    !StringUtils.hasText(ticket.getProgramme()) ||
                    ticket.getRegistrationType() == null) {
                throw new IllegalArgumentException("Registration questions require academic year, semester, programme, and registration type");
            }
        }

        if (ticket.getRequestType() == Ticket.RequestType.INFORM_EQUIPMENT_FAILURE ||
                ticket.getRequestType() == Ticket.RequestType.INFORM_FACILITY_ISSUE ||
                ticket.getRequestType() == Ticket.RequestType.INFORM_SOFTWARE_PROBLEM ||
                ticket.getRequestType() == Ticket.RequestType.INFORM_NETWORK_ISSUE) {
            if (!StringUtils.hasText(ticket.getBuildingNumber()) ||
                    !StringUtils.hasText(ticket.getRoomNumber()) ||
                    !StringUtils.hasText(ticket.getItemNumber()) ||
                    !StringUtils.hasText(ticket.getIncidentDescription())) {
                throw new IllegalArgumentException("Incident requests require building number, room number, item number, and incident description");
            }
        }
    }
}
