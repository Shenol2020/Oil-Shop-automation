package DisanayakeOilCenter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @JsonProperty("oder_date")
    @Column(nullable = false)
    private LocalDateTime orderDate;

    @JsonProperty("total_amount")
    @Column(nullable = false)
    private Double totalAmount;

    @JsonProperty("order_status")
    @Column(nullable = false)
    private String orderStatus;

    //@OneToOne(mappedBy = "customerOrder", cascade = CascadeType.ALL)
    @JsonProperty("payment")
    //@Column(nullable = false)
    private String payment;

    // Connects the order to the associative entity (CustomerOrderItem)
    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("customerOrder") // Prevents infinite recursion when sending JSON to React
    private List<CustomerOrderItem> orderItems = new ArrayList<>();

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