package DisanayakeOilCenter.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "main_admin")
public class MainAdmin extends Management {
    public MainAdmin() {
        super();
        setAccessLevel("ADMIN");
    }

    public MainAdmin(String userId, String name, String email, String password, String address,
                     String phoneNumber, LocalDate dateJoined,String accessLevel,String qrCodeBase64) {
        super(userId, name, email, password, address, phoneNumber, dateJoined, qrCodeBase64);
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