package com.sliit.paf.service.member3;

import com.sliit.paf.dto.member3.CommentRequest;
import com.sliit.paf.dto.member3.CommentUpdateRequest;
import com.sliit.paf.exception.ResourceNotFoundException;
import com.sliit.paf.exception.UnauthorizedException;
import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketComment;
import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.TicketCommentRepository;
import com.sliit.paf.repository.member3.TicketRepository;
import com.sliit.paf.repository.member3.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketCommentService {
    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketCommentService(TicketCommentRepository commentRepository,
                                TicketRepository ticketRepository,
                                UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<TicketComment> getCommentsForTicket(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Page<TicketComment> getCommentsForTicket(Long ticketId, Pageable pageable) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket, pageable);
    }

    public Object[] getCommentStatistics(Long ticketId) {
        return commentRepository.getCommentStatisticsByTicketId(ticketId);
    }

    @Transactional
    public TicketComment addComment(Long ticketId, CommentRequest request, Long userId, boolean isAdmin) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setCommentedBy(author);
        comment.setContent(request.getContent().trim());
        comment.setIsInternal(Boolean.TRUE.equals(request.getIsInternalComment()) && isAdmin);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Transactional
    public TicketComment updateComment(Long commentId, CommentUpdateRequest request, Long userId, boolean isAdmin) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!isAdmin && !comment.getCommentedBy().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        if (!StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("Comment content cannot be blank");
        }

        comment.setContent(request.getContent().trim());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!isAdmin && !comment.getCommentedBy().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }
}
