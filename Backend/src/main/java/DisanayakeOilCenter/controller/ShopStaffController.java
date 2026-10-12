package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.ShopStaff;
import DisanayakeOilCenter.repository.ShopStaffRepository;
import DisanayakeOilCenter.util.QrCodeGenerator;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class ShopStaffController {

    private final ShopStaffRepository shopStaffRepository;

    public ShopStaffController(ShopStaffRepository shopStaffRepository) {
        this.shopStaffRepository = shopStaffRepository;
    }

    @PostMapping("/register")
    public ShopStaff register(@RequestBody Map<String, String> body) throws Exception {
        String name = body.get("name");
        String email = body.get("email");

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        ShopStaff staff = new ShopStaff();
        staff.setName(name);
        staff.setEmail(email);
        staff.setDateJoined(LocalDate.now());

        // Save first so the database generates the String userId
        staff = shopStaffRepository.save(staff);

        // Generate QR Code using the ID and set it
        String qrBase64 = QrCodeGenerator.generateBase64(staff.getUserId(), 300);
        staff.setQrCodeBase64(qrBase64);

        // Save again to persist the QR code
        return shopStaffRepository.save(staff);
    }

    @GetMapping("/{id}")
    public ShopStaff getStaff(@PathVariable String id) {
        return shopStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
    }
}