package DisanayakeOilCenter.service;

import DisanayakeOilCenter.dto.CreateSaleRequest;
import DisanayakeOilCenter.dto.InvoiceResponse;
import DisanayakeOilCenter.dto.OrderItemRequest;
import DisanayakeOilCenter.dto.SaleResponse;
import DisanayakeOilCenter.model.*;
import DisanayakeOilCenter.repository.InvoiceRepository;
import DisanayakeOilCenter.repository.SaleRepository;
import DisanayakeOilCenter.repository.SalesReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SaleService {
    private final SaleRepository saleRepository;
    private final InvoiceRepository invoiceRepository;
    private final SalesReportRepository salesReportRepository;
    private final ProductService productService;
    private final ResponseMapper responseMapper;

    public SaleService(SaleRepository saleRepository,
                       InvoiceRepository invoiceRepository,
                       SalesReportRepository salesReportRepository,
    ProductService productService,
    ResponseMapper responseMapper) {
        this.saleRepository = saleRepository;
        this.invoiceRepository = invoiceRepository;
        this.salesReportRepository = salesReportRepository;
        this.productService = productService;
        this.responseMapper = responseMapper;
    }

    @Transactional
    public SaleResponse createSale(CreateSaleRequest request) {
        Sale sale = new Sale();
        LocalDate saleDate = request.getSaleDate() != null ? request.getSaleDate() : LocalDate.now();
        sale.setSaleDate(saleDate);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<SaleItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProduct(itemReq.getProductId());
            
            // Reduce stock
            productService.decreaseStock(product.getpID(), itemReq.getQuantity());

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());

            BigDecimal unitPrice = itemReq.getUnitPrice();
            if (unitPrice == null) {
                try {
                    unitPrice = new BigDecimal(product.getPrice());
                } catch (Exception e) {
                    unitPrice = BigDecimal.ZERO;
                }
            }
            item.setUnitPrice(unitPrice);

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            item.setLineTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);

            items.add(item);
        }

        sale.setItems(items);
        sale.setSubtotal(subtotal);
        sale.setTotalAmount(subtotal); // Can add tax/discount if needed, keeping simple

        Sale savedSale = saleRepository.save(sale);

        // Generate Invoice automatically
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setInvoiceDate(saleDate);
        invoice.setSale(savedSale);
        invoice.setTotalAmount(savedSale.getTotalAmount());
        invoiceRepository.save(invoice);

        savedSale.setInvoice(invoice);
        return responseMapper.toSaleResponse(savedSale);
    }

    public List<SaleResponse> getAllSales() {
        return responseMapper.toSaleResponses(saleRepository.findAll());
    }

    public SaleResponse getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + id));
        return responseMapper.toSaleResponse(sale);
    }

    public List<SaleResponse> getSalesByDate(LocalDate date) {
        return responseMapper.toSaleResponses(saleRepository.findBySaleDate(date));
    }

    public List<SaleResponse> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        return responseMapper.toSaleResponses(saleRepository.findBySaleDateBetween(startDate, endDate));
    }

    public InvoiceResponse getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber);
        if (invoice == null) {
            throw new RuntimeException("Invoice not found: " + invoiceNumber);
        }
        return responseMapper.toInvoiceResponse(invoice);
    }

    public InvoiceResponse getInvoiceBySaleId(Long saleId) {
        Invoice invoice = invoiceRepository.findBySale_SaleId(saleId);
        if (invoice == null) {
            throw new RuntimeException("Invoice not found for sale id: " + saleId);
        }
        return responseMapper.toInvoiceResponse(invoice);
    }

    @Transactional
    public SalesReport generateReport(ReportType type, LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = saleRepository.findBySaleDateBetween(startDate, endDate);
        long count = sales.size();
        BigDecimal totalRevenue = sales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        SalesReport report = new SalesReport();
        report.setReportType(type);
        report.setPeriodStart(startDate);
        report.setPeriodEnd(endDate);
        report.setNumberOfSales(count);
        report.setTotalRevenue(totalRevenue);
        report.setTotalSales(totalRevenue);

        return salesReportRepository.save(report);
    }

    public List<SalesReport> getAllReports() { return salesReportRepository.findAll();}

}
