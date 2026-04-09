package com.sliit.paf.dto.member3;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketCommentResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isInternal;
    private Author author;

    @Data
    public static class Author {
        private Long id;
        private String name;
    }
}
