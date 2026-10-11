
package DisanayakeOilCenter.service;

import DisanayakeOilCenter.model.LeaveBalance;
import DisanayakeOilCenter.model.LeaveRequest;
import DisanayakeOilCenter.model.LeaveStatus;
import DisanayakeOilCenter.model.LeaveType;
import DisanayakeOilCenter.model.Notification;
import DisanayakeOilCenter.model.ShopStaff;

import DisanayakeOilCenter.repository.EmployeeRepository;
import DisanayakeOilCenter.repository.LeaveBalanceRepository;
import DisanayakeOilCenter.repository.LeaveRequestRepository;
import DisanayakeOilCenter.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationRepository notificationRepository;

    public LeaveService(
            EmployeeRepository employeeRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            LeaveRequestRepository leaveRequestRepository,
            NotificationRepository notificationRepository) {

        this.employeeRepository = employeeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationRepository = notificationRepository;
    }

    // ==========================================
    // HELPER: FIND STAFF LEAVE BALANCE
    // ==========================================


    private LeaveBalance getLeaveBalance(ShopStaff employee) {

        return leaveBalanceRepository.findByShopStaff(employee)
                .orElseGet(() -> {
                    LeaveBalance balance = new LeaveBalance();
                    balance.setShopStaff(employee);

                    return leaveBalanceRepository.save(balance);
                });
    }


    // ==========================================
    // HELPER: GET TOTAL LEAVE ALLOWANCE
    // ==========================================

    private double getTotalLeaves(
            LeaveBalance balance,
            LeaveType leaveType) {

        switch (leaveType) {
            case ANNUAL:
                return balance.getAnnualLeaves();

            case SICK:
                return balance.getSickLeaves();

            case CASUAL:
                return balance.getCasualLeaves();

            case OTHER:
                return balance.getOtherLeaves();

            default:
                throw new RuntimeException("Invalid leave type.");
        }
    }

    // ==========================================
    // HELPER: GET USED LEAVES
    // ==========================================

    private double getUsedLeaves(
            LeaveBalance balance,
            LeaveType leaveType) {

        switch (leaveType) {
            case ANNUAL:
                return balance.getUsedAnnualLeaves();

            case SICK:
                return balance.getUsedSickLeaves();

            case CASUAL:
                return balance.getUsedCasualLeaves();

            case OTHER:
                return balance.getUsedOtherLeaves();

            default:
                throw new RuntimeException("Invalid leave type.");
        }
    }

    // ==========================================
    // HELPER: UPDATE USED LEAVES
    // ==========================================

    private void addUsedLeaves(
            LeaveBalance balance,
            LeaveType leaveType,
            long days) {

        switch (leaveType) {
            case ANNUAL:
                balance.setUsedAnnualLeaves(
                        balance.getUsedAnnualLeaves() + days);
                break;

            case SICK:
                balance.setUsedSickLeaves(
                        balance.getUsedSickLeaves() + days);
                break;

            case CASUAL:
                balance.setUsedCasualLeaves(
                        balance.getUsedCasualLeaves() + days);
                break;

            case OTHER:
                balance.setUsedOtherLeaves(
                        balance.getUsedOtherLeaves() + days);
                break;

            default:
                throw new RuntimeException("Invalid leave type.");
        }
    }

    // ==========================================
    // EMPLOYEE: REQUEST LEAVE
    // ==========================================

    @Transactional
    public LeaveRequest requestLeave(LeaveRequest leaveRequest) {

        // Check employee
        if (leaveRequest.getEmployee() == null
                || leaveRequest.getEmployee().getUserId() == null) {

            throw new RuntimeException("Employee ID is required.");
        }

        ShopStaff employee = employeeRepository
                .findById(leaveRequest.getEmployee().getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found."));

        // Check dates
        if (leaveRequest.getStartDate() == null
                || leaveRequest.getEndDate() == null) {

            throw new RuntimeException(
                    "Start date and end date are required.");
        }

        if (leaveRequest.getEndDate()
                .isBefore(leaveRequest.getStartDate())) {

            throw new RuntimeException(
                    "End date cannot be before start date.");
        }

        // Check leave type
        LeaveType leaveType = leaveRequest.getLeaveType();

        if (leaveType == null) {
            throw new RuntimeException("Leave type is required.");
        }

        // Calculate requested days, including both start and end dates
        long requestedDays = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        // Get the separate LeaveBalance record
        LeaveBalance balance = getLeaveBalance(employee);

        // Get allowance and already-used leaves
        double totalLeaves = getTotalLeaves(balance, leaveType);
        double usedLeaves = getUsedLeaves(balance, leaveType);

        // Count existing pending requests of the same type
        long pendingDays = leaveRequestRepository
                .findByEmployeeUserId(employee.getUserId())
                .stream()
                .filter(request ->
                        request.getLeaveStatus() == LeaveStatus.PENDING)
                .filter(request ->
                        request.getLeaveType() == leaveType)
                .mapToLong(request ->
                        ChronoUnit.DAYS.between(
                                request.getStartDate(),
                                request.getEndDate()
                        ) + 1)
                .sum();

        // Calculate available leave
        double remainingLeaves =
                totalLeaves - usedLeaves - pendingDays;

        // Prevent requests exceeding available leave
        if (requestedDays > remainingLeaves) {

            throw new RuntimeException(
                    "Not enough " + leaveType
                            + " leave. Remaining available: "
                            + remainingLeaves
                            + ", Requested: " + requestedDays
            );
        }

        // Assign the actual employee from the database
        leaveRequest.setEmployee(employee);

        // New requests are pending
        leaveRequest.setLeaveStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(leaveRequest);
    }

    // ==========================================
    // ADMIN: GET PENDING REQUESTS
    // ==========================================

    public List<LeaveRequest> getPendingLeaves() {

        return leaveRequestRepository
                .findByLeaveStatus(LeaveStatus.PENDING);
    }

    // ==========================================
    // ADMIN: APPROVE LEAVE
    // ==========================================

    @Transactional
    public LeaveRequest approveLeave(
            Long leaveId,
            String adminComment) {

        LeaveRequest leaveRequest = leaveRequestRepository
                .findById(leaveId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave request not found."));

        // Only pending requests can be approved
        if (leaveRequest.getLeaveStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be approved.");
        }

        ShopStaff employee = leaveRequest.getEmployee();

        LeaveType leaveType = leaveRequest.getLeaveType();

        long requestedDays = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        // Get the separate leave balance
        LeaveBalance balance = getLeaveBalance(employee);

        // Check balance again before approval
        double totalLeaves = getTotalLeaves(balance, leaveType);
        double usedLeaves = getUsedLeaves(balance, leaveType);

        if (requestedDays > totalLeaves - usedLeaves) {

            throw new RuntimeException(
                    "Insufficient leave balance to approve this request.");
        }

        // Update used leave in LeaveBalance, not ShopStaff
        addUsedLeaves(balance, leaveType, requestedDays);

        leaveBalanceRepository.save(balance);

        // Update request status and admin comment
        leaveRequest.setLeaveStatus(LeaveStatus.APPROVED);
        leaveRequest.setAdminComment(adminComment);

        leaveRequestRepository.save(leaveRequest);

        // Notify employee
        Notification notification = new Notification(
                employee,
                "Your " + leaveType
                        + " leave request has been APPROVED."
        );

        notificationRepository.save(notification);

        return leaveRequest;
    }

    // ==========================================
    // ADMIN: REJECT LEAVE
    // ==========================================

    @Transactional
    public LeaveRequest rejectLeave(
            Long leaveId,
            String adminComment) {

        LeaveRequest leaveRequest = leaveRequestRepository
                .findById(leaveId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave request not found."));

        // Only pending requests can be rejected
        if (leaveRequest.getLeaveStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be rejected.");
        }

        leaveRequest.setLeaveStatus(LeaveStatus.REJECTED);
        leaveRequest.setAdminComment(adminComment);

        leaveRequestRepository.save(leaveRequest);

        // Rejected requests do not consume leave balance
        Notification notification = new Notification(
                leaveRequest.getEmployee(),
                "Your " + leaveRequest.getLeaveType()
                        + " leave request has been REJECTED."
        );

        notificationRepository.save(notification);

        return leaveRequest;
    }
}
