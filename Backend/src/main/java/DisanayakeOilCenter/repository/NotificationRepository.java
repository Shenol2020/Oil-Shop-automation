package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long>{
    List<Notification> findByEmployeeUserId(String userId);

}
