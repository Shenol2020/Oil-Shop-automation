package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.Invoice;
import DisanayakeOilCenter.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    @Autowired
    private SaleService saleService;

    @GetMapping("/number/{invoiceNumber}")
    public Invoice getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return saleService.getInvoiceByNumber(invoiceNumber);
    }

    @GetMapping("/sale/{saleId}")
    public Invoice getInvoiceBySaleId(@PathVariable Long saleId) {
        return saleService.getInvoiceBySaleId(saleId);
    }
}
