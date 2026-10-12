package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.Manager;
import DisanayakeOilCenter.repository.ShopStaffRepository;
import DisanayakeOilCenter.util.QrCodeGenerator;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
public class ManagerController {

    private final ShopStaffRepository shopStaffRepository;

    public ManagerController(ShopStaffRepository shopStaffRepository) {
        this.shopStaffRepository = shopStaffRepository;
    }

    @PostMapping("/register")
    public Manager register(@RequestBody Map<String, String> body) throws Exception {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String address = body.get("address");
        String phoneNumber = body.get("phoneNumber");

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        Manager manager = new Manager();
        manager.setName(name);
        manager.setEmail(email);
        manager.setPassword(password);
        manager.setAddress(address);
        manager.setPhoneNumber(phoneNumber);
        manager.setDateJoined(LocalDate.now());

        manager = shopStaffRepository.save(manager);

        String qrBase64 = QrCodeGenerator.generateBase64(manager.getUserId(), 300);
        manager.setQrCodeBase64(qrBase64);

        return shopStaffRepository.save(manager);
    }

    @GetMapping("/{id}")
    public Manager getManager(@PathVariable String id) {
        return (Manager) shopStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
    }
}
