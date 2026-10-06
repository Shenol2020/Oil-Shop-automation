package DisanayakeOilCenter.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")

public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;

    @Enumerated(EnumType.STRING)
    private LeaveStatus leaveStatus;

    private String adminComment;

    public LeaveRequest(){
    }

    public Long getId(){
        return id;
    }
    public Employee getEmployee(){
        return employee;
    }
    public LocalDate getStartDate(){
        return startDate;
    }
    public LocalDate getEndDate(){
        return endDate;
    }
    public String getReason(){
        return reason;
    }
    public LeaveType getLeaveType(){
        return leaveType;
    }
    public  LeaveStatus getLeaveStatus(){
        return leaveStatus;
    }
    public String getAdminComment(){
        return adminComment;
    }

    public void setEmployee(Employee employee){
        this.employee = employee;
    }
    public void setStartDate(LocalDate startDate){
        this.startDate = startDate;
    }
    public void setEndDate(LocalDate endDate){
        this.endDate = endDate;
    }
    public void setReason(String reason){
        this.reason = reason;
    }
    public void setLeaveType(LeaveType leaveType){
        this.leaveType = leaveType;
    }
    public void setLeaveStatus(LeaveStatus leaveStatus){
        this.leaveStatus = leaveStatus;
    }
    public void setAdminComment(String adminComment){
        this.adminComment = adminComment;
    }
}
