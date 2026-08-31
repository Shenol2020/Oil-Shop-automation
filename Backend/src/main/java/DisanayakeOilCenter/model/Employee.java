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

    private int annualLeaves = 14;
    private int usedAnnualLeaves = 0;
    private int sickLeaves = 8;
    private int usedSickLeaves = 0;
    private int casualLeaves = 8;
    private int usedCasualLeaves = 0;
    private int otherLeaves = 5;
    private int usedOtherLeaves = 0;


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
    public int getAnnualLeaves() {
        return annualLeaves;
    }
    public int getUsedAnnualLeaves() {
        return usedAnnualLeaves;
    }
    public int getSickLeaves() {
        return sickLeaves;
    }
    public int getUsedSickLeaves() {
        return usedSickLeaves;
    }
    public int getCasualLeaves() {
        return casualLeaves;
    }
    public int getUsedCasualLeaves() {
        return usedCasualLeaves;
    }
    public int getOtherLeaves() {
        return otherLeaves;
    }
    public int getUsedOtherLeaves() {
        return usedOtherLeaves;
    }

    public void setName(String name){
        this.name = name;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setAnnualLeaves(int annualLeaves) {
        this.annualLeaves = annualLeaves;
    }
    public void setUsedAnnualLeaves(int usedAnnualLeaves) {
        this.usedAnnualLeaves = usedAnnualLeaves;
    }
    public void setSickLeaves(int sickLeaves) {
        this.sickLeaves = sickLeaves;
    }
    public void setUsedSickLeaves(int usedSickLeaves) {
        this.usedSickLeaves = usedSickLeaves;
    }
    public void setCasualLeaves(int casualLeaves) {
        this.casualLeaves = casualLeaves;
    }
    public void setUsedCasualLeaves(int usedCasualLeaves) {
        this.usedCasualLeaves = usedCasualLeaves;
    }
    public void setOtherLeaves(int otherLeaves) {
        this.otherLeaves = otherLeaves;
    }
    public void setUsedOtherLeaves(int usedOtherLeaves) {
        this.usedOtherLeaves = usedOtherLeaves;
    }

    public int getRemainingAnnualLeaves() {
        return annualLeaves - usedAnnualLeaves;
    }
    public int getRemainingSickLeaves() {
        return sickLeaves - usedSickLeaves;
    }
    public int getRemainingCasualLeaves() {
        return casualLeaves - usedCasualLeaves;
    }
    public int getRemainingOtherLeaves() {
        return otherLeaves - usedOtherLeaves;
    }

}
