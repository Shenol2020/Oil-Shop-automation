package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class Employee extends ShopStaff {

    public Employee() {
        super();
        setAccessLevel("EMPLOYEE");
    }

    public Employee(String userId, String name, String email, String password, String address,
                    String phoneNumber, LocalDate dateJoined) {
        super(userId, name, email, password, address, phoneNumber, dateJoined);
        setAccessLevel("EMPLOYEE");
    }

    @Override
    public String getUserType() {
        return "Employee";
    }

    @Override
    public String displayProfile() {
        return "Employee: " + getName() +  " , Access: " + getAccessLevel();
    }
}