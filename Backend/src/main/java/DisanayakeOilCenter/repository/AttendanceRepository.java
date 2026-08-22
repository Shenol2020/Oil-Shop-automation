package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, UUID> {
    Optional<DisanayakeOilCenter.model.AttendanceRecord> findByUserIdAndWorkDate(UUID userId, LocalDate workDate);
}