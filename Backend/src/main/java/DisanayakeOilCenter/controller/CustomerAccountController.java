package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.CustomerAccount;
import DisanayakeOilCenter.repository.CustomerAccountRepository;
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

@RestController
@RequestMapping("/api/customer_accounts")
@CrossOrigin(origins = "http://localhost:5173") // Fixes the CORS error for Vite!
public class CustomerAccountController {
    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @GetMapping
    public List<CustomerAccount> getAllCustomers() {
        //return customerAccountRepository.findAll(); // Fetches all rows and converts to JSON
        List<CustomerAccount> customers = customerAccountRepository.findAll();
        System.out.println("Total customers found in DB: " + customers.size());
        return customers;
    }

    @PostMapping("/signup")
    public CustomerAccount createAccount(@RequestBody CustomerAccount newAccount) {
        // The @RequestBody annotation automatically converts React's JSON into a Java object
        System.out.println("=== NEW SIGNUP REQUEST ===");
        System.out.println("Name received: " + newAccount.getUserName());
        System.out.println("Email received: " + newAccount.getEmail());
        System.out.println("Password received: " + newAccount.getUserPassword());
        System.out.println("==========================");

        return customerAccountRepository.save(newAccount);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAccount(@RequestBody CustomerAccount loginRequest) {
        // 1. Search the database for the provided email
        CustomerAccount existingUser = customerAccountRepository.findByEmail(loginRequest.getEmail());

        // 2. Check if the user exists AND the passwords match
        if (existingUser != null && existingUser.getUserPassword().equals(loginRequest.getUserPassword())) {
            // Success: Return HTTP 200 and the user details (so React can save the user_id)
            return ResponseEntity.ok(existingUser);
        } else {
            // Fail: Return HTTP 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
