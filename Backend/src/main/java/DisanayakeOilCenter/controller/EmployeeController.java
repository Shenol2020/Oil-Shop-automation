package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.Employee;
import DisanayakeOilCenter.repository.ShopStaffRepository;
import DisanayakeOilCenter.util.QrCodeGenerator;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final ShopStaffRepository shopStaffRepository;

    public EmployeeController(ShopStaffRepository shopStaffRepository) {
        this.shopStaffRepository = shopStaffRepository;
    }

    @PostMapping("/register")
    public Employee register(@RequestBody Map<String, String> body) throws Exception {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String address = body.get("address");
        String phoneNumber = body.get("phoneNumber");

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        Employee employee = new Employee();
        employee.setName(name);
        employee.setEmail(email);
        employee.setPassword(password);
        employee.setAddress(address);
        employee.setPhoneNumber(phoneNumber);
        employee.setDateJoined(LocalDate.now());

        employee = shopStaffRepository.save(employee);

        String qrBase64 = QrCodeGenerator.generateBase64(employee.getUserId(), 300);
        employee.setQrCodeBase64(qrBase64);

        return shopStaffRepository.save(employee);
    }

    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable String id) {
        return (Employee) shopStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }
}
