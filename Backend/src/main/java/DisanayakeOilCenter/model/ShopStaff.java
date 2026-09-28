package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class ShopStaff extends SystemUser {
    private LocalDate dateJoined;

    public ShopStaff() {
        super();
        setAccessLevel("STAFF");
    }

    public ShopStaff(String userId, String name, String email, String password, String address,
                     String phoneNumber, LocalDate dateJoined) {
        super(userId, name, email, password, address, phoneNumber);
        this.dateJoined = dateJoined;
        setAccessLevel("STAFF");
    }

    public LocalDate getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(LocalDate dateJoined) {
        this.dateJoined = dateJoined;
    }

    @Override
    public void login(String email, String password) {
        System.out.println("ShopStaff login attempt for: " + email);
    }

    @Override
    public String getUserType() {
        return "Shop Staff";
    }

    @Override
    public String displayProfile() {
        return "Shop Staff: " + getName() + ", Joined on " + dateJoined + ", Access: " + getAccessLevel();
    }

    public String displayProfile(String role) {
        return role + " - " + displayProfile();
    }
}