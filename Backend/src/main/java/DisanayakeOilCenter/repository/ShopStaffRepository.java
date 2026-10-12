package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.ShopStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopStaffRepository extends JpaRepository<ShopStaff, String> {
}