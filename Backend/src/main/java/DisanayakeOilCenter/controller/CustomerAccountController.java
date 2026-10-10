package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.OnlineCustomer;
import DisanayakeOilCenter.repository.OnlineCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/customer_accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerAccountController {
    @Autowired
    private OnlineCustomerRepository customerAccountRepository;

    @GetMapping
    public List<OnlineCustomer> getAllCustomers() {
        List<OnlineCustomer> customers = customerAccountRepository.findAll();
        System.out.println("Total customers found in DB: " + customers.size());
        return customers;
    }

    @PostMapping("/signup")
    public OnlineCustomer createAccount(@RequestBody Map<String, String> payload) {
        String name = payload.get("userName") != null ? payload.get("userName") : payload.get("name");
        String email = payload.get("email");
        String password = payload.get("userPassword") != null ? payload.get("userPassword") : payload.get("password");

        System.out.println("=== NEW SIGNUP REQUEST ===");
        System.out.println("Name received: " + name);
        System.out.println("Email received: " + email);
        System.out.println("Password received: " + password);
        System.out.println("==========================");

        OnlineCustomer newAccount = new OnlineCustomer();
        newAccount.setName(name);
        newAccount.setEmail(email);
        newAccount.setPassword(password);

        return customerAccountRepository.save(newAccount);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAccount(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("userPassword") != null ? payload.get("userPassword") : payload.get("password");

        OnlineCustomer existingUser = customerAccountRepository.findByEmail(email);

        if (existingUser != null && Objects.equals(existingUser.getPassword(), password)) {
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
