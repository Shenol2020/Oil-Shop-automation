package DisanayakeOilCenter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_order")
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("order_id")
    private Integer orderId;

    // Links to the customer (Nullable because POS walk-in customers don't have accounts)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private CustomerAccount customer;

    // We will map this to the Employee entity later (Nullable because online orders don't have a cashier)
    /*@Column(name = "employee_id", nullable = true)
    private Integer employeeId;*/

    @JsonProperty("order_date")
    @Column(nullable = false)
    private LocalDateTime orderDate;

    @JsonProperty("total_amount")
    @Column(nullable = false)
    private Double totalAmount;

    @JsonProperty("order_status")
    @Column(nullable = false)
    private String orderStatus; // e.g., "Pending", "Completed", "Cancelled"

    /*@JsonProperty("order_method")
    @Column(nullable = false)
    private String orderMethod; // "Online" or "In-Store"*/

    @JsonProperty("payment")
    @Column(nullable = false)
    private String payment; // "Cash", "Card", "Online Gateway"

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public CustomerAccount getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerAccount customer) {
        this.customer = customer;
    }

    /*public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }*/

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }
}