package com.sliit.paf.service.member4;

import com.sliit.paf.model.member4.Notification;
import com.sliit.paf.repository.member4.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification send(Long userId, String message, String type, String link) {
        Objects.requireNonNull(userId, "userId must not be null");
        Notification n = Notification.builder()
            .userId(userId)
            .message(message)
            .type(type != null ? type : "INFO")
            .link(link)
            .build();
        return Objects.requireNonNull(notificationRepository.save(n));
    }

    public List<Notification> getUserNotifications(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Long> getUnreadCount(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        return Map.of("count", notificationRepository.countByUserIdAndReadFalse(userId));
    }

    public Notification markAsRead(Long notificationId, Long userId) {
        Objects.requireNonNull(notificationId, "notificationId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        n.setRead(true);
        return Objects.requireNonNull(notificationRepository.save(n));
    }

    public void delete(Long notificationId, Long userId) {
        Objects.requireNonNull(notificationId, "notificationId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notificationRepository.delete(n);
    }
}