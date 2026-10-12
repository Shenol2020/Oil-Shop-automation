package DisanayakeOilCenter.dto;

import DisanayakeOilCenter.model.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PurchaseOrderResponse {
    private Long purchaseOrderId;
    private LocalDate orderDate;
    private PurchaseOrderStatus status;
    private BigDecimal totalAmount;
    private SupplierSummaryResponse supplier;
    private List<PurchaseOrderItemResponse> items;

    public Long getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public PurchaseOrderStatus getStatus() {
        return status;
    }

    public void setStatus(PurchaseOrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public SupplierSummaryResponse getSupplier() {
        return supplier;
    }

    public void setSupplier(SupplierSummaryResponse supplier) {
        this.supplier = supplier;
    }

    public List<PurchaseOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<PurchaseOrderItemResponse> items) {
        this.items = items;
    }
}
