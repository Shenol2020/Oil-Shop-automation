package DisanayakeOilCenter.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "staff_user_id", referencedColumnName = "userId", unique = true)
    private ShopStaff shopStaff;

    @Column(columnDefinition = "DOUBLE DEFAULT 14")
    private double annualLeaves = 14;
    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private double usedAnnualLeaves = 0;

    @Column(columnDefinition = "DOUBLE DEFAULT 8")
    private double sickLeaves = 8;
    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private double usedSickLeaves = 0;

    @Column(columnDefinition = "DOUBLE DEFAULT 8")
    private double casualLeaves = 8;
    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private double usedCasualLeaves = 0;

    @Column(columnDefinition = "DOUBLE DEFAULT 5")
    private double otherLeaves = 5;
    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private double usedOtherLeaves = 0;

    public LeaveBalance() {
    }

    public Long getId() {
        return id;
    }

    public ShopStaff getShopStaff() {
        return shopStaff;
    }

    public void setShopStaff(ShopStaff shopStaff) {
        this.shopStaff = shopStaff;
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
}