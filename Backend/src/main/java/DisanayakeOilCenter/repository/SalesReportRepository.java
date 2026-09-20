package DisanayakeOilCenter.repository;

import DisanayakeOilCenter.model.ReportType;
import DisanayakeOilCenter.model.SalesReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SalesReportRepository extends JpaRepository<SalesReport, Long> {
    List<SalesReport> findByReportTypeAndPeriodStartAndPeriodEnd(ReportType reportType, LocalDate periodStart, LocalDate periodEnd);
}
