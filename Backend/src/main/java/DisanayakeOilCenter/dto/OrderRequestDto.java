package DisanayakeOilCenter.dto;
import java.util.List;

public class OrderRequestDto {
    private Integer userId; // Will match the currentUserId from React local storage
    private String paymentMethod; // e.g., "Cash", "Card"
    private List<CartItemDto> cartItems;

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public List<CartItemDto> getCartItems() {
        return cartItems;
    }
    public void setCartItems(List<CartItemDto> cartItems) {
        this.cartItems = cartItems;
    }
}
