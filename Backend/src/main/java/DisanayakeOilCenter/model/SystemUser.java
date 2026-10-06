package DisanayakeOilCenter.model;
import jakarta.persistence.*;

@MappedSuperclass
public class SystemUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;
    private String name;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private String accessLevel;

    public SystemUser() {
        this.accessLevel = "STANDARD";
    }

    public SystemUser(String userId, String name, String email, String password, String address, String phoneNumber) {
        this(userId, name, email, password, address, phoneNumber, "STANDARD");
    }

    public SystemUser(String userId, String name, String email, String password, String address, String phoneNumber, String accessLevel) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.accessLevel = accessLevel;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public boolean hasAccess(String requiredLevel) {
        if (requiredLevel == null || requiredLevel.isBlank()) {
            return true;
        }
        return this.accessLevel != null && this.accessLevel.equalsIgnoreCase(requiredLevel);
    }

    public void register() {
        System.out.println("User registered successfully.");
    }

    public void register(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        System.out.println("User created using overloaded register method.");
    }

    public void register(String userId, String name, String email, String password, String address, String phoneNumber) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phoneNumber = phoneNumber;
        System.out.println("SystemUser registered using full user profile.");
    }

    public void login(String email, String password) {
        System.out.println("Checking login for: " + email);
    }

    public String displayInfo() {
        return "User ID: " + userId + ", Name: " + name + ", Email: " + email + ", Access Level: " + accessLevel;
    }

    public String displayInfo(String title) {
        return title + " - " + displayInfo();
    }

    public String getUserType() {
        return "System User";
    }

    public String displayProfile() {
        return "System User: " + name + ", Access Level: " + accessLevel;
    }

    @Override
    public String toString() {
        return "SystemUser{" +
                "userId='" + userId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", accessLevel='" + accessLevel + '\'' +
                '}';
    }
}