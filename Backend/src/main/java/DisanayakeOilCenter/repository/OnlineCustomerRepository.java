package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.OnlineCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OnlineCustomerRepository extends JpaRepository<OnlineCustomer, String> {
    OnlineCustomer findByEmail(String email);
}
