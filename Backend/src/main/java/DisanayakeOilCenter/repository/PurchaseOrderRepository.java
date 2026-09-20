package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByOrderDate(LocalDate orderDate);
    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);
}
