package com.sliit.paf.dto.member3;

import lombok.Data;

@Data
public class TicketTimelineRequest {
    private Boolean includeComments = true;
    private Boolean includeInternalComments = false;
}
