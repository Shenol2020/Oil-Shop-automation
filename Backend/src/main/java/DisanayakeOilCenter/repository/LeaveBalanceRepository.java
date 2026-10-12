
package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.LeaveBalance;
import DisanayakeOilCenter.model.ShopStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByShopStaff(ShopStaff shopStaff);
}
