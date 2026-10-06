package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.dto.CreateSaleRequest;
import DisanayakeOilCenter.dto.SaleResponse;
import DisanayakeOilCenter.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping("/create")
    public SaleResponse createSale(@RequestBody CreateSaleRequest request) {
        return saleService.createSale(request);
    }

    @GetMapping("/all")
    public List<SaleResponse> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/{saleId}")
    public SaleResponse getSaleById(@PathVariable Long saleId) {
        return saleService.getSaleById(saleId);
    }

    @GetMapping("/by-date")
    public List<SaleResponse> getSalesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return saleService.getSalesByDate(date);
    }

    @GetMapping("/by-range")
    public List<SaleResponse> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return saleService.getSalesByDateRange(start, end);
    }
}
