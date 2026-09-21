package DisanayakeOilCenter.dto;

import java.time.LocalDate;
import java.util.List;

public class CreateSaleRequest {
    private LocalDate saleDate;
    private List<OrderItemRequest> items;

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
