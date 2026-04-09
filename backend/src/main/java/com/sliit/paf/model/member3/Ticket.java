package com.sliit.paf.model.member3;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String contactInfo;

    private String requesterName;

    private String requesterEmail;

    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    private RequesterType requesterType;

    private String contactNumber;

    @Enumerated(EnumType.STRING)
    private FacultyOrSchool facultyOrSchool;

    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    private OfficialDocumentType officialDocumentType;

    private String academicYear;

    private String academicSemester;

    private String programme;

    @Enumerated(EnumType.STRING)
    private RegistrationType registrationType;

    private String buildingNumber;

    private String roomNumber;

    private String itemNumber;

    @Column(columnDefinition = "TEXT")
    private String incidentDescription;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TicketAttachment> attachments;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TicketComment> comments;

    public enum TicketCategory {
        EQUIPMENT_FAILURE,
        FACILITY_ISSUE,
        SOFTWARE_PROBLEM,
        NETWORK_ISSUE,
        OTHER
    }

    public enum TicketPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        REJECTED
    }

    public enum RequesterType {
        STUDENT,
        LECTURER
    }

    public enum FacultyOrSchool {
        FACULTY_OF_COMPUTING,
        SCHOOL_OF_BUSINESS,
        FACULTY_OF_ENGINEERING,
        FACULTY_OF_HUMANITIES_AND_SCIENCE,
        SCHOOL_OF_ARCHITECTURE,
        FACULTY_OF_GRADUATE_STUDIES_AND_RESEARCH
    }

    public enum RequestType {
        REQUEST_OFFICIAL_DOCUMENT,
        QUESTION_ABOUT_REGISTRATION,
        INFORM_EQUIPMENT_FAILURE,
        INFORM_FACILITY_ISSUE,
        INFORM_SOFTWARE_PROBLEM,
        INFORM_NETWORK_ISSUE,
        OTHER
    }

    public enum OfficialDocumentType {
        LETTER,
        CERTIFICATE,
        TRANSCRIPT,
        RESULT_SHEET
    }

    public enum RegistrationType {
        SEMESTER_REGISTRATION,
        PRORATA_REGISTRATION,
        REPEAT_REGISTRATION,
        OTHER
    }
}
