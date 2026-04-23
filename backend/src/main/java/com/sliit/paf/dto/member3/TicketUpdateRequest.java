package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketType;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketUpdateRequest {
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private TicketType type;

    private Ticket.TicketPriority priority;

    private LocalDateTime dueDate;

    private List<String> tags;

    // Compatibility fields used by current service implementation.
    private Ticket.TicketCategory category;

    private String location;

    private String contactInfo;

    private String requesterName;

    private String requesterEmail;

    private String registrationNumber;

    private Ticket.RequesterType requesterType;

    private String contactNumber;

    private Ticket.FacultyOrSchool facultyOrSchool;

    private Ticket.RequestType requestType;

    private Ticket.OfficialDocumentType officialDocumentType;

    private String academicYear;

    private String academicSemester;

    private String programme;

    private Ticket.RegistrationType registrationType;

    private String buildingNumber;

    private String roomNumber;

    private String itemNumber;

    private String incidentDescription;

    @Size(max = 500, message = "Resolution notes cannot exceed 500 characters")
    private String resolutionNotes;
}
