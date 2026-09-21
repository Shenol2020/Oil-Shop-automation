package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Spring Data JPA writes the basic CRUD SQL queries for you
    List<Product> findByCategoryID(int categoryID);
    @Query("SELECT p FROM Product p WHERE LOWER(p.p_name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByp_nameContainingIgnoreCase(@Param("name") String name);
}
