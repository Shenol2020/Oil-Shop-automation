package DisanayakeOilCenter.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "online_customer")
public class OnlineCustomer extends SystemUser {
    @Column(nullable = false)
    private LocalDate registeredAt;

    public OnlineCustomer() {
        super();
        setAccessLevel("CUSTOMER");
        this.registeredAt = LocalDate.now();
    }

    public OnlineCustomer(String userId, String name, String email, String password, String address,
                          String phoneNumber, LocalDate registeredAt) {
        super(userId, name, email, password, address, phoneNumber);
        this.registeredAt = registeredAt != null ? registeredAt : LocalDate.now();
        setAccessLevel("CUSTOMER");
    }

    @Override
    @JsonProperty("userName")
    @JsonAlias({"name"})
    public void setName(String name) {
        super.setName(name);
    }

    @Override
    @JsonProperty("userName")
    public String getName() {
        return super.getName();
    }

    @Override
    @JsonProperty("userPassword")
    @JsonAlias({"password"})
    public void setPassword(String password) {
        super.setPassword(password);
    }

    @Override
    @JsonProperty("userPassword")
    public String getPassword() {
        return super.getPassword();
    }

    public LocalDate getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDate registeredAt) {
        this.registeredAt = registeredAt != null ? registeredAt : LocalDate.now();
    }

    @Override
    public String getUserType() {
        return "Online Customer";
    }

    @Override
    public String displayProfile() {
        return "Online Customer: " + getName() + ", Registered on " + registeredAt + ", Access: " + getAccessLevel();
    }
}