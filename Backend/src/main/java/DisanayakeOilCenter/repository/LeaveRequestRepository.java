package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.LeaveRequest;
import DisanayakeOilCenter.model.LeaveStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByLeaveStatus(LeaveStatus leaveStatus);
    List<LeaveRequest> findByEmployeeUserId(String userId);

}
