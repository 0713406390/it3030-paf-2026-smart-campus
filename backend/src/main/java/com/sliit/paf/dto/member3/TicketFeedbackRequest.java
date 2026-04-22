package com.sliit.paf.dto.member3;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketFeedbackRequest {
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Integer rating;

    @Size(max = 1000, message = "Feedback cannot exceed 1000 characters")
    private String feedback;

    private Boolean wasResolvedOnTime;
    private Boolean wasStaffHelpful;
    private Boolean wouldRecommendService;
    private String additionalComments;
}
