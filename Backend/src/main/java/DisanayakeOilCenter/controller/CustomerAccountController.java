package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.CustomerAccount;
import DisanayakeOilCenter.repository.CustomerAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        System.out.println("Total customers found in DB: " + customers.size()); // Check your VS Code terminal!
        return customers;
    }
}
