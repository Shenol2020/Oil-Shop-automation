package DisanayakeOilCenter.dto;

import java.time.LocalDate;
import java.util.List;

public class CreatePurchaseOrderRequest {
    private Integer supplierId;
    private LocalDate orderDate;
    private List<OrderItemRequest> items;

    public Integer getSupplierId() { return supplierId; }
    public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
