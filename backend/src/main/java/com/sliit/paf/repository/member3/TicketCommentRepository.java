package com.sliit.paf.repository.member3;

import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketComment;
import com.sliit.paf.model.member3.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
    List<TicketComment> findByTicketOrderByCreatedAtAsc(Ticket ticket);

    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    Page<TicketComment> findByTicketOrderByCreatedAtAsc(Ticket ticket, Pageable pageable);

    Optional<TicketComment> findByIdAndTicket(Long id, Ticket ticket);

    List<TicketComment> findByCommentedBy(User user);

    List<TicketComment> findByCommentedById(Long userId);

    Page<TicketComment> findByCommentedByOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT c FROM TicketComment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :text, '%'))")
    List<TicketComment> findByContentContainingIgnoreCase(@Param("text") String text);

    @Query("SELECT c FROM TicketComment c WHERE c.ticket.id = :ticketId AND LOWER(c.content) LIKE LOWER(CONCAT('%', :text, '%'))")
    List<TicketComment> findByTicketIdAndContentContainingIgnoreCase(@Param("ticketId") Long ticketId, @Param("text") String text);

    long countByTicket(Ticket ticket);

    long countByTicketId(Long ticketId);

    @Query("SELECT c FROM TicketComment c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    List<TicketComment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT * FROM ticket_comments WHERE ticket_id = :ticketId ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<TicketComment> findRecentCommentsByTicketId(@Param("ticketId") Long ticketId, @Param("limit") int limit);

    @Query("SELECT c FROM TicketComment c JOIN FETCH c.ticket t JOIN FETCH c.commentedBy u WHERE c.id = :id")
    Optional<TicketComment> findByIdWithDetails(@Param("id") Long id);

    void deleteByTicket(Ticket ticket);

    void deleteByTicketId(Long ticketId);

    @Query("SELECT c FROM TicketComment c WHERE c.isInternal = true AND c.ticket.id = :ticketId")
    List<TicketComment> findInternalCommentsByTicketId(@Param("ticketId") Long ticketId);

    @Query("SELECT c FROM TicketComment c WHERE c.isInternal = false AND c.ticket.id = :ticketId")
    List<TicketComment> findPublicCommentsByTicketId(@Param("ticketId") Long ticketId);

    @Query("SELECT COUNT(c), SUM(CASE WHEN c.isInternal = true THEN 1 ELSE 0 END), SUM(CASE WHEN c.isInternal = false THEN 1 ELSE 0 END), MIN(c.createdAt), MAX(c.createdAt) FROM TicketComment c WHERE c.ticket.id = :ticketId")
    Object[] getCommentStatisticsByTicketId(@Param("ticketId") Long ticketId);
}
