package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class OnlineCustomer extends SystemUser {
    private LocalDate registeredAt;

    public OnlineCustomer() {
        super();
        setAccessLevel("CUSTOMER");
    }

    public OnlineCustomer(String userId, String name, String email, String password, String address,
                          String phoneNumber, LocalDate registeredAt) {
        super(userId, name, email, password, address, phoneNumber);
        this.registeredAt = registeredAt;
        setAccessLevel("CUSTOMER");
    }

    public LocalDate getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDate registeredAt) {
        this.registeredAt = registeredAt;
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