package com.sliit.paf.dto.member3;

import com.sliit.paf.model.member3.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Ticket.TicketCategory category;

    @NotNull(message = "Priority is required")
    private Ticket.TicketPriority priority;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Contact information is required")
    private String contactInfo;

    @NotBlank(message = "Name is required")
    private String requesterName;

    @NotBlank(message = "Email is required")
    private String requesterEmail;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotNull(message = "Requester type is required")
    private Ticket.RequesterType requesterType;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @NotNull(message = "Faculty or school is required")
    private Ticket.FacultyOrSchool facultyOrSchool;

    @NotNull(message = "Request type is required")
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
}
