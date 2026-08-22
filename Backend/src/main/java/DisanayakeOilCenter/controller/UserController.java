package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.User;
import DisanayakeOilCenter.repository.UserRepository;
import DisanayakeOilCenter.util.QrCodeGenerator;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // tighten this in production
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body) throws Exception {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        User user = new User();
        user.setName(name);
        user = userRepository.save(user); // saved first so id is generated

        String qrBase64 = QrCodeGenerator.generateBase64(user.getId().toString(), 300);
        user.setQrCodeBase64(qrBase64);

        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return userRepository.findById(java.util.UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}