package DisanayakeOilCenter.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nortifications")

public class Nortifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    public Nortifications() {
    }

    public Nortifications(Employee employee, String message) {
        this.employee = employee;
        this.message = message;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }
    public Employee getEmployee(){
        return employee;
    }
    public String getMessage(){
        return message;
    }

    public boolean isRead(){
        return isRead;
    }

    public void setRead(boolean read){
        isRead = read;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
}
