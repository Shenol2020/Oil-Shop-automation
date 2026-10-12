package DisanayakeOilCenter.service;

import DisanayakeOilCenter.model.Product;
import DisanayakeOilCenter.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Integer id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Integer id, Product updated) {
        Product existing = getProduct(id);
        existing.setP_name(updated.getP_name());
        existing.setVolume(updated.getVolume());
        existing.setCategoryID(updated.getCategoryID());
        existing.setBrand(updated.getBrand());
        existing.setSupplierID(updated.getSupplierID());
        existing.setPrice(updated.getPrice());
        existing.setCurrent_stock_quantity(updated.getCurrent_stock_quantity());
        existing.setP_description(updated.getP_description());
        existing.setPic(updated.getPic());
        return productRepository.save(existing);
    }

    public void deleteProduct(Integer id) {
        Product existing = getProduct(id);
        productRepository.delete(existing);
    }

    public Product updateStock(Integer id, int newStock) {
        Product existing = getProduct(id);
        existing.setCurrent_stock_quantity(newStock);
        return productRepository.save(existing);
    }

    public Product increaseStock(Integer id, int qty) {
        if (qty <= 0) {
            throw new RuntimeException("Quantity should be greater than zero");
        }
        Product existing = getProduct(id);
        existing.setCurrent_stock_quantity(existing.getCurrent_stock_quantity() + qty);
        return productRepository.save(existing);
    }

    public Product decreaseStock(Integer id, int qty) {
        if (qty <= 0) {
            throw new RuntimeException("Quantity should be greater than zero");
        }
        Product existing = getProduct(id);
        if (existing.getCurrent_stock_quantity() < qty) {
            throw new RuntimeException("Insufficient stock for product: " + existing.getP_name());
        }
        existing.setCurrent_stock_quantity(existing.getCurrent_stock_quantity() - qty);
        return productRepository.save(existing);
    }
}
