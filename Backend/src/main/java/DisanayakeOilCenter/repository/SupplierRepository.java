package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {}
