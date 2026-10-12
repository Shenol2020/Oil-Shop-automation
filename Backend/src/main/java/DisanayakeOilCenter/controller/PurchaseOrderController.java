package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.dto.CreatePurchaseOrderRequest;
import DisanayakeOilCenter.dto.PurchaseOrderResponse;
import DisanayakeOilCenter.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @PostMapping("/create")
    public PurchaseOrderResponse createPurchaseOrder(@RequestBody CreatePurchaseOrderRequest request) {
        return purchaseOrderService.createPurchaseOrder(request);
    }

    @PutMapping("/complete/{orderId}")
    public PurchaseOrderResponse completePurchaseOrder(@PathVariable Long orderId) {
        return purchaseOrderService.completePurchaseOrder(orderId);
    }

    @GetMapping("/all")
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{orderId}")
    public PurchaseOrderResponse getPurchaseOrderById(@PathVariable Long orderId) {
        return purchaseOrderService.getPurchaseOrderResponseById(orderId);
    }

    @GetMapping("/by-date")
    public List<PurchaseOrderResponse> getPurchaseOrdersByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return purchaseOrderService.getPurchaseOrdersByDate(date);
    }
}
