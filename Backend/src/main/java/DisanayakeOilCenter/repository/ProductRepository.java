package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA writes the basic CRUD SQL queries for you
}
