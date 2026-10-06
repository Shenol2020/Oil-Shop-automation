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

    // Leave fields migrated from Employee
    private double annualLeaves = 14;
    private double usedAnnualLeaves = 0;
    private double sickLeaves = 8;
    private double usedSickLeaves = 0;
    private double casualLeaves = 8;
    private double usedCasualLeaves = 0;
    private double otherLeaves = 5;
    private double usedOtherLeaves = 0;

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

    public LocalDate getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(LocalDate dateJoined) {
        this.dateJoined = dateJoined;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }

    public double getAnnualLeaves() {
        return annualLeaves;
    }

    public void setAnnualLeaves(double annualLeaves) {
        this.annualLeaves = annualLeaves;
    }

    public double getUsedAnnualLeaves() {
        return usedAnnualLeaves;
    }

    public void setUsedAnnualLeaves(double usedAnnualLeaves) {
        this.usedAnnualLeaves = usedAnnualLeaves;
    }

    public double getSickLeaves() {
        return sickLeaves;
    }

    public void setSickLeaves(double sickLeaves) {
        this.sickLeaves = sickLeaves;
    }

    public double getUsedSickLeaves() {
        return usedSickLeaves;
    }

    public void setUsedSickLeaves(double usedSickLeaves) {
        this.usedSickLeaves = usedSickLeaves;
    }

    public double getCasualLeaves() {
        return casualLeaves;
    }

    public void setCasualLeaves(double casualLeaves) {
        this.casualLeaves = casualLeaves;
    }

    public double getUsedCasualLeaves() {
        return usedCasualLeaves;
    }

    public void setUsedCasualLeaves(double usedCasualLeaves) {
        this.usedCasualLeaves = usedCasualLeaves;
    }

    public double getOtherLeaves() {
        return otherLeaves;
    }

    public void setOtherLeaves(double otherLeaves) {
        this.otherLeaves = otherLeaves;
    }

    public double getUsedOtherLeaves() {
        return usedOtherLeaves;
    }

    public void setUsedOtherLeaves(double usedOtherLeaves) {
        this.usedOtherLeaves = usedOtherLeaves;
    }

    public double getRemainingAnnualLeaves() {
        return annualLeaves - usedAnnualLeaves;
    }

    public double getRemainingSickLeaves() {
        return sickLeaves - usedSickLeaves;
    }

    public double getRemainingCasualLeaves() {
        return casualLeaves - usedCasualLeaves;
    }

    public double getRemainingOtherLeaves() {
        return otherLeaves - usedOtherLeaves;
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