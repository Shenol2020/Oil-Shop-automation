package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.MainAdmin;
import DisanayakeOilCenter.repository.ShopStaffRepository;
import DisanayakeOilCenter.util.QrCodeGenerator;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/main-admin")
@CrossOrigin(origins = "*")
public class MainAdminController {

    private final ShopStaffRepository shopStaffRepository;

    public MainAdminController(ShopStaffRepository shopStaffRepository) {
        this.shopStaffRepository = shopStaffRepository;
    }

    @PostMapping("/register")
    public MainAdmin register(@RequestBody Map<String, String> body) throws Exception {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String address = body.get("address");
        String phoneNumber = body.get("phoneNumber");

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        MainAdmin mainAdmin = new MainAdmin();
        mainAdmin.setName(name);
        mainAdmin.setEmail(email);
        mainAdmin.setPassword(password);
        mainAdmin.setAddress(address);
        mainAdmin.setPhoneNumber(phoneNumber);
        mainAdmin.setDateJoined(LocalDate.now());
        mainAdmin.setAccessLevel("ADMIN");

        mainAdmin = shopStaffRepository.save(mainAdmin);

        String qrBase64 = QrCodeGenerator.generateBase64(mainAdmin.getUserId(), 300);
        mainAdmin.setQrCodeBase64(qrBase64);

        return shopStaffRepository.save(mainAdmin);
    }

    @GetMapping("/{id}")
    public MainAdmin getMainAdmin(@PathVariable String id) {
        return (MainAdmin) shopStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Main Admin not found"));
    }
}
