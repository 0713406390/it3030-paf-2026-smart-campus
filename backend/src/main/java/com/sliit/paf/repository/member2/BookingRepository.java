package com.sliit.paf.repository.member2;

import com.sliit.paf.model.member2.Booking;
import com.sliit.paf.model.member2.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;


public interface BookingRepository extends JpaRepository<Booking, Long>{
    // Get all bookings for a specific user
    List<Booking> findByUserId(String userId);

    // Get bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // CONFLICT CHECK — This is the most important query
    // Checks if any PENDING or APPROVED booking exists for the same resource
    // that overlaps with the requested time range
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.resourceId = :rid " +
           "AND b.id != :excludeId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
           
    boolean existsConflict(
        @Param("rid") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeId") Long excludeId
    );
}


