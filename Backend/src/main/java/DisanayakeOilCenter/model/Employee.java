package DisanayakeOilCenter.model;
import jakarta.persistence.*;

@Entity
@Table(name="employees")

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String name;
    private String email;

    private double annualLeaves = 14;
    private double usedAnnualLeaves = 0;
    private double sickLeaves = 8;
    private double usedSickLeaves = 0;
    private double casualLeaves = 8;
    private double usedCasualLeaves = 0;
    private double otherLeaves = 5;
    private double usedOtherLeaves = 0;


    public Employee() {
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getEmail(){
        return email;
    }
    public double getAnnualLeaves() {
        return annualLeaves;
    }
    public double getUsedAnnualLeaves() {
        return usedAnnualLeaves;
    }
    public double getSickLeaves() {
        return sickLeaves;
    }
    public double getUsedSickLeaves() {
        return usedSickLeaves;
    }
    public double getCasualLeaves() {
        return casualLeaves;
    }
    public double getUsedCasualLeaves() {
        return usedCasualLeaves;
    }
    public double getOtherLeaves() {
        return otherLeaves;
    }
    public double getUsedOtherLeaves() {
        return usedOtherLeaves;
    }

    public void setName(String name){
        this.name = name;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setAnnualLeaves(double annualLeaves) {
        this.annualLeaves = annualLeaves;
    }
    public void setUsedAnnualLeaves(double usedAnnualLeaves) {
        this.usedAnnualLeaves = usedAnnualLeaves;
    }
    public void setSickLeaves(double sickLeaves) {
        this.sickLeaves = sickLeaves;
    }
    public void setUsedSickLeaves(double usedSickLeaves) {
        this.usedSickLeaves = usedSickLeaves;
    }
    public void setCasualLeaves(double casualLeaves) {
        this.casualLeaves = casualLeaves;
    }
    public void setUsedCasualLeaves(double usedCasualLeaves) {
        this.usedCasualLeaves = usedCasualLeaves;
    }
    public void setOtherLeaves(double otherLeaves) {
        this.otherLeaves = otherLeaves;
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

