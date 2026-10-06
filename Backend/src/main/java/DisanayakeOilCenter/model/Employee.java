package DisanayakeOilCenter.model;

import jakarta.persistence.Entity;
import java.time.LocalDate;

@Entity
public class Employee extends ShopStaff {

    public Employee() {
        super();
        setAccessLevel("EMPLOYEE");
    }

    public Employee(String userId, String name, String email, String password, String address,
                    String phoneNumber, LocalDate dateJoined, String qrCodeBase64) {
        super(userId, name, email, password, address, phoneNumber, dateJoined, qrCodeBase64);
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