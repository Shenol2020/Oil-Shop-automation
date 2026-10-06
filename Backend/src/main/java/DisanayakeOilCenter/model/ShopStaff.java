package DisanayakeOilCenter.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "shop_staff")
public class ShopStaff extends SystemUser {
    private LocalDate dateJoined;

    @Lob
    @Column(name = "qr_code_base64", columnDefinition = "LONGTEXT")
    private String qrCodeBase64;


    public ShopStaff() {
        super();
        setAccessLevel("STAFF");
    }


    public ShopStaff(String userId, String name, String email, String password, String address,
                     String phoneNumber, LocalDate dateJoined, String qrCodeBase64) {
        super(userId, name, email, password, address, phoneNumber);
        this.dateJoined = dateJoined;
        this.qrCodeBase64 = qrCodeBase64;
        setAccessLevel("STAFF");
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
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
        return "Shop Staff: " + getName() + ", Joined on " + dateJoined + ", Access: " + getAccessLevel() + ", QR Code: " + getQrCodeBase64();
    }

    public String displayProfile(String role) {
        return role + " - " + displayProfile();
    }
}