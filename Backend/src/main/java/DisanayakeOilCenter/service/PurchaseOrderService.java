package DisanayakeOilCenter.service;

import DisanayakeOilCenter.dto.CreatePurchaseOrderRequest;
import DisanayakeOilCenter.dto.OrderItemRequest;
import DisanayakeOilCenter.model.Product;
import DisanayakeOilCenter.model.PurchaseOrder;
import DisanayakeOilCenter.model.PurchaseOrderItem;
import DisanayakeOilCenter.model.PurchaseOrderStatus;
import DisanayakeOilCenter.model.Supplier;
import DisanayakeOilCenter.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseOrderService {
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierService supplierService;
    private final ProductService productService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                SupplierService supplierService,
                                ProductService productService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierService = supplierService;
        this.productService = productService;
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(CreatePurchaseOrderRequest request) {
        Supplier supplier = supplierService.getSupplierById(request.getSupplierId());

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now());
        order.setStatus(PurchaseOrderStatus.CREATED);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PurchaseOrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProduct(itemReq.getProductId());
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            
            BigDecimal unitPrice = itemReq.getUnitPrice();
            if (unitPrice == null) {
                // fall back to parsing product price
                try {
                    unitPrice = new BigDecimal(product.getPrice());
                } catch (Exception e) {
                    unitPrice = BigDecimal.ZERO;
                }
            }
            item.setUnitPrice(unitPrice);
            
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            item.setLineTotal(lineTotal);
            totalAmount = totalAmount.add(lineTotal);

            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        return purchaseOrderRepository.save(order);
    }

    @Transactional
    public PurchaseOrder completePurchaseOrder(Long orderId) {
        PurchaseOrder order = getPurchaseOrderById(orderId);
        if (order.getStatus() == PurchaseOrderStatus.COMPLETED) {
            throw new RuntimeException("Purchase order is already completed");
        }

        // Increase product stocks
        for (PurchaseOrderItem item : order.getItems()) {
            productService.increaseStock(item.getProduct().getpID(), item.getQuantity());
        }

        order.setStatus(PurchaseOrderStatus.COMPLETED);
        return purchaseOrderRepository.save(order);
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with ID: " + id));
    }

    public List<PurchaseOrder> getPurchaseOrdersByDate(LocalDate date) {
        return purchaseOrderRepository.findByOrderDate(date);
    }
}
