package com.sliit.paf.repository.member3;

import com.sliit.paf.model.member3.Ticket;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByReporterId(Long reporterId, Pageable pageable);

       Page<Ticket> findByReporterIdOrReporterUsername(Long reporterId, String reporterUsername, Pageable pageable);

    Page<Ticket> findByAssignedTechnicianId(Long technicianId, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Ticket> findByFilters(@Param("status") Ticket.TicketStatus status,
                               @Param("category") Ticket.TicketCategory category,
                               @Param("priority") Ticket.TicketPriority priority,
                               Pageable pageable);

   Page<Ticket> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime createdAt, Pageable pageable);
}
