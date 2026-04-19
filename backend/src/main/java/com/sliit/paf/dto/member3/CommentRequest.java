package com.sliit.paf.dto.member3;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CommentRequest {
    @NotBlank(message = "Comment content cannot be blank")
    @Size(min = 3, max = 2000, message = "Comment must be between 3 and 2000 characters")
    private String content;

    private Boolean isInternalComment = false;
    private Long parentCommentId;
    private List<Long> mentionUserIds;
    private Boolean notifyAssignee = true;
}
