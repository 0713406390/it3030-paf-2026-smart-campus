package com.sliit.paf.service.member4;

import com.sliit.paf.model.member4.Notification;
import com.sliit.paf.repository.member4.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Member 4 - Notification Service
 *
 * OTHER MEMBERS use this to send notifications:
 *
 * Example (in booking service):
 *   notificationService.send(userId, "BOOKING_APPROVED",
 *       "Your booking was approved!", "/bookings/123");
 */
@Service
@SuppressWarnings("null")
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Called by other members to send a notification
    public void send(Long userId, String type, String message, String link) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .link(link)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}