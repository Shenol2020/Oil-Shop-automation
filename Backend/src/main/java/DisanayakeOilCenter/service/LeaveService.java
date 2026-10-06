package DisanayakeOilCenter.service;

import DisanayakeOilCenter.model.Employee;
import DisanayakeOilCenter.model.LeaveRequest;
import DisanayakeOilCenter.model.LeaveStatus;
import DisanayakeOilCenter.model.LeaveType;
import DisanayakeOilCenter.model.Notification;
import DisanayakeOilCenter.repository.EmployeeRepository;
import DisanayakeOilCenter.repository.LeaveRequestRepository;
import DisanayakeOilCenter.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import java.time.temporal.ChronoUnit;

@Service
public class LeaveService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationRepository notificationRepository;

    public LeaveService(
            EmployeeRepository employeeRepository,
            LeaveRequestRepository leaveRequestRepository,
            NotificationRepository notificationRepository) {

        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationRepository = notificationRepository;
    }

    // ==============================
    // EMPLOYEE REQUEST LEAVE
    // ==============================

    public LeaveRequest requestLeave(LeaveRequest leaveRequest) {

        // Check employee
        if (leaveRequest.getEmployee() == null ||
                leaveRequest.getEmployee().getId() == null) {

            throw new RuntimeException("Employee ID is required.");
        }
        System.out.println(
                "Employee ID received: "
                        + leaveRequest.getEmployee().getId());

        Employee employee = employeeRepository
                .findById(leaveRequest.getEmployee().getId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        // Check dates
        if (leaveRequest.getStartDate() == null ||
                leaveRequest.getEndDate() == null) {

            throw new RuntimeException(
                    "Start date and end date are required."
            );
        }

        // Check end date
        if (leaveRequest.getEndDate()
                .isBefore(leaveRequest.getStartDate())) {

            throw new RuntimeException(
                    "End date cannot be before start date."
            );
        }

        // Calculate requested days
        long requestedDays = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        // Check leave type
        LeaveType leaveType = leaveRequest.getLeaveType();

        if (leaveType == null) {
            throw new RuntimeException(
                    "Leave type is required."
            );
        }

        // Get total leave limit
        double totalLeaves;

        switch (leaveType) {

            case ANNUAL:
                totalLeaves = employee.getAnnualLeaves();
                break;

            case SICK:
                totalLeaves = employee.getSickLeaves();
                break;

            case CASUAL:
                totalLeaves = employee.getCasualLeaves();
                break;

            case OTHER:
                totalLeaves = employee.getOtherLeaves();
                break;

            default:
                throw new RuntimeException(
                        "Invalid leave type."
                );
        }

        // Get already used/approved leaves
        double usedLeaves;

        switch (leaveType) {

            case ANNUAL:
                usedLeaves = employee.getUsedAnnualLeaves();
                break;

            case SICK:
                usedLeaves = employee.getUsedSickLeaves();
                break;

            case CASUAL:
                usedLeaves = employee.getUsedCasualLeaves();
                break;

            case OTHER:
                usedLeaves = employee.getUsedOtherLeaves();
                break;

            default:
                throw new RuntimeException(
                        "Invalid leave type."
                );
        }

        // ==========================================
        // CHECK PENDING LEAVE REQUESTS
        // ==========================================

        long pendingDays = leaveRequestRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .filter(request ->
                        request.getLeaveStatus() == LeaveStatus.PENDING)
                .filter(request ->
                        request.getLeaveType() == leaveType)
                .mapToLong(request ->
                        ChronoUnit.DAYS.between(
                                request.getStartDate(),
                                request.getEndDate()
                        ) + 1
                )
                .sum();

        // Calculate remaining leaves
        double remainingLeaves =
                totalLeaves - usedLeaves - pendingDays;

        // Check whether enough leaves are available
        if (requestedDays > remainingLeaves) {

            throw new RuntimeException(
                    "Not enough " + leaveType +
                            " leave. Remaining available: "
                            + remainingLeaves +
                            ", Requested: "
                            + requestedDays
            );
        }

        // Set employee from database
        leaveRequest.setEmployee(employee);

        // New request starts as PENDING
        leaveRequest.setLeaveStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(leaveRequest);
    }


    // ==============================
// ADMIN GET PENDING LEAVE REQUESTS
// ==============================

    public List<LeaveRequest> getPendingLeaves() {

        return leaveRequestRepository
                .findByLeaveStatus(LeaveStatus.PENDING);
    }


    // ==============================
    // ADMIN APPROVE LEAVE
    // ==============================

    @Transactional
    public LeaveRequest approveLeave(
            Long leaveId,
            String adminComment) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        // Only pending requests can be approved
        if (leaveRequest.getLeaveStatus()
                != LeaveStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending leave requests can be approved."
            );
        }

        Employee employee = leaveRequest.getEmployee();

        // Calculate number of leave days
        long requestedDays = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        // Update used leave count
        switch (leaveRequest.getLeaveType()) {

            case ANNUAL:

                employee.setUsedAnnualLeaves(
                        employee.getUsedAnnualLeaves()
                                + (int) requestedDays
                );

                break;

            case SICK:

                employee.setUsedSickLeaves(
                        employee.getUsedSickLeaves()
                                + (int) requestedDays
                );

                break;

            case CASUAL:

                employee.setUsedCasualLeaves(
                        employee.getUsedCasualLeaves()
                                + (int) requestedDays
                );

                break;

            case OTHER:

                employee.setUsedOtherLeaves(
                        employee.getUsedOtherLeaves()
                                + (int) requestedDays
                );

                break;

            default:
                throw new RuntimeException(
                        "Invalid leave type."
                );
        }

        // Change status
        leaveRequest.setLeaveStatus(LeaveStatus.APPROVED);

        // Save admin comment
        leaveRequest.setAdminComment(adminComment);

        employeeRepository.save(employee);
        leaveRequestRepository.save(leaveRequest);

        // Create notification
        Notification notification = new Notification(
                employee,
                "Your " + leaveRequest.getLeaveType()
                        + " leave request has been APPROVED."
        );

        notificationRepository.save(notification);

        return leaveRequest;
    }


    // ==============================
    // ADMIN REJECT LEAVE
    // ==============================

    @Transactional
    public LeaveRequest rejectLeave(
            Long leaveId,
            String adminComment) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        // Only pending requests can be rejected
        if (leaveRequest.getLeaveStatus()
                != LeaveStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending leave requests can be rejected."
            );
        }

        // Change status
        leaveRequest.setLeaveStatus(LeaveStatus.REJECTED);

        // Save admin comment
        leaveRequest.setAdminComment(adminComment);

        leaveRequestRepository.save(leaveRequest);

        // IMPORTANT:
        // Do NOT increase used leaves when rejected.

        // Create notification
        Notification notification = new Notification(
                leaveRequest.getEmployee(),
                "Your " + leaveRequest.getLeaveType()
                        + " leave request has been REJECTED."
        );

        notificationRepository.save(notification);

        return leaveRequest;
    }
}

