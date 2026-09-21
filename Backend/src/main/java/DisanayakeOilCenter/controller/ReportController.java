package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.ReportType;
import DisanayakeOilCenter.model.SalesReport;
import DisanayakeOilCenter.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private SaleService saleService;

    @PostMapping("/daily")
    public SalesReport createDailyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return saleService.generateReport(ReportType.DAILY, date, date);
    }

    @PostMapping("/monthly")
    public SalesReport createMonthlyReport(
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        return saleService.generateReport(ReportType.MONTHLY, start, end);
    }

    @GetMapping("/all")
    public List<SalesReport> getAllReports() {
        return saleService.getAllReports();
    }
}
