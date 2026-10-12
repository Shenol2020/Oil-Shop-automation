
package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.Notification;
import DisanayakeOilCenter.repository.NotificationRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Get notifications for one employee
    @GetMapping("/employee/{userId}")
    public List<Notification> getEmployeeNotifications(
            @PathVariable String userId) {

        return notificationRepository
                .findByEmployeeUserId(userId);
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }
}
