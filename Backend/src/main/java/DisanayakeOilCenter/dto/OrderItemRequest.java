package DisanayakeOilCenter.dto;

import java.math.BigDecimal;

public class OrderItemRequest {
    private Integer productId;
    private int quantity;
    private BigDecimal unitPrice;

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
