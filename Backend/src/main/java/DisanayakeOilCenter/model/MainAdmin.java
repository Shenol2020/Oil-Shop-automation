package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class MainAdmin extends Management {
    public MainAdmin() {
        super();
        setAccessLevel("ADMIN");
    }

    public MainAdmin(String userId, String name, String email, String password, String address,
                     String phoneNumber, LocalDate dateJoined,String accessLevel) {
        super(userId, name, email, password, address, phoneNumber, dateJoined);
        setAccessLevel(accessLevel);
    }

    @Override
    public String getUserType() {
        return "Main Admin";
    }

    @Override
    public String displayProfile() {
        return "Main Admin: " + getName() + ", Access: " + getAccessLevel();
    }
}