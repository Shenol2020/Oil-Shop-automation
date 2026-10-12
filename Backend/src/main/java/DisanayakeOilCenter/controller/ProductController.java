package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.Product;
import DisanayakeOilCenter.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Fixes the CORS error for Vite!
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll(); // Fetches all rows and converts to JSON
    }
    @GetMapping("/getProduct/{pID}")
    public Product getProductById(@PathVariable Integer pID) {
        return productRepository.findById(pID).orElse(null);
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String query) {
        return productRepository.findByp_nameContainingIgnoreCase(query);
    }
    @GetMapping("/category/{categoryID}")
    public List<Product> getProductsByCategory(@PathVariable int categoryID) {
        return productRepository.findByCategoryID(categoryID);
    }
    @PutMapping("/updateStock/{pID}")
    public Product updateStock(@PathVariable Integer pID, @RequestBody Product updatedData) {
        Product existingProduct = productRepository.findById(pID).orElse(null);
        if (existingProduct != null) {
            existingProduct.setCurrent_stock_quantity(updatedData.getCurrent_stock_quantity());
            return productRepository.save(existingProduct);
        }
        return null;
    }
    @PutMapping("/updatePrice/{pID}")
    public Product updatePrice(@PathVariable Integer pID, @RequestBody Product updatedData) {
        Product existingProduct = productRepository.findById(pID).orElse(null);
        if (existingProduct != null) {
            existingProduct.setPrice(updatedData.getPrice());
            return productRepository.save(existingProduct);
        }
        return null;
    }

    @DeleteMapping("/remove/{pID}")
    public Product removeProduct(@PathVariable Integer pID) {
        Product product = productRepository.findById(pID).orElse(null);
        if (product != null) {
            productRepository.delete(product);
        }
        return product;
    }
}