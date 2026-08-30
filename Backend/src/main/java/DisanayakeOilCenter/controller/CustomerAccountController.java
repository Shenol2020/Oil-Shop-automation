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
}
