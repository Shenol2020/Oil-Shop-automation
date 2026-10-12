package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Invoice findByInvoiceNumber(String invoiceNumber);
    Invoice findBySale_SaleId(Long saleId);
}
