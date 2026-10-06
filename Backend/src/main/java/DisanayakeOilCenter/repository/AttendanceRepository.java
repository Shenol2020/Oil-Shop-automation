package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    // Parameter updated to String
    Optional<AttendanceRecord> findByUserIdAndWorkDate(String userId, LocalDate workDate);
}