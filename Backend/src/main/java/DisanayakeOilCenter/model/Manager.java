package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class Manager extends Management {

    public Manager() {
        super();
        setAccessLevel("MANAGER");
    }

    public Manager(String userId, String name, String email, String password, String address,
                   String phoneNumber, LocalDate dateJoined, String branchName) {
        super(userId, name, email, password, address, phoneNumber, dateJoined);

        setAccessLevel("MANAGER");
    }


    @Override
    public String getUserType() {
        return "Manager";
    }

    @Override
    public String displayProfile() {
        return "Manager: " + getName() + ", Access: " + getAccessLevel();
    }
}