package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, Long> {
    CustomerAccount findByEmail(String email);
    //CustomerAccount findById(Integer id);
}
