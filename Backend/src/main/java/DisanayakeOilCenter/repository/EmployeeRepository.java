package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long>{
}
