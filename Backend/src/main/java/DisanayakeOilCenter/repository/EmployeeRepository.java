package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.ShopStaff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository
        extends JpaRepository<ShopStaff, String>{
}
