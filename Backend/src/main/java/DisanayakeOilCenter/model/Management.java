package DisanayakeOilCenter.model;

import java.time.LocalDate;

public class Management extends ShopStaff {

    public Management() {
        super();
        setAccessLevel("MANAGER");
    }

    public Management(String userId, String name, String email, String password, String address,
                      String phoneNumber, LocalDate dateJoined,String qrCodeBase64) {
        super(userId, name, email, password, address, phoneNumber, dateJoined, qrCodeBase64);
        setAccessLevel("MANAGER");
    }

    @Override
    public String getUserType() {
        return "Management";
    }

    @Override
    public String displayProfile() {
        return "Management: " + getName() + ", Access: " + getAccessLevel();
    }
}