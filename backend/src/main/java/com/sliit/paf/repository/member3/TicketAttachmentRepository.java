package com.sliit.paf.repository.member3;

import com.sliit.paf.model.member3.Ticket;
import com.sliit.paf.model.member3.TicketAttachment;
import com.sliit.paf.model.member3.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    List<TicketAttachment> findByTicket(Ticket ticket);

    List<TicketAttachment> findByTicketId(Long ticketId);

    Optional<TicketAttachment> findByIdAndTicket(Long id, Ticket ticket);

    List<TicketAttachment> findByUploadedBy(User user);

    List<TicketAttachment> findByUploadedById(Long userId);

    List<TicketAttachment> findByFileNameContainingIgnoreCase(String fileName);

    @Query("SELECT a FROM TicketAttachment a WHERE a.fileName LIKE %:extension")
    List<TicketAttachment> findByFileType(@Param("extension") String extension);

    long countByTicket(Ticket ticket);

    long countByTicketId(Long ticketId);

    @Query("SELECT a FROM TicketAttachment a WHERE a.fileSize > :size")
    List<TicketAttachment> findByFileSizeGreaterThan(@Param("size") long size);

    void deleteByTicket(Ticket ticket);

    void deleteByTicketId(Long ticketId);

    @Query("SELECT a FROM TicketAttachment a JOIN FETCH a.ticket t LEFT JOIN FETCH a.uploadedBy u WHERE a.id = :id")
    Optional<TicketAttachment> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(a.fileSize), 0) FROM TicketAttachment a")
    long getTotalStorageUsed();

    @Query("SELECT COALESCE(SUM(a.fileSize), 0) FROM TicketAttachment a WHERE a.ticket.id = :ticketId")
    long getStorageUsedByTicket(@Param("ticketId") Long ticketId);
}
