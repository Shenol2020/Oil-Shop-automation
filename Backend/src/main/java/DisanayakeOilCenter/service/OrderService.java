package DisanayakeOilCenter.service;

import DisanayakeOilCenter.dto.CartItemDto;
import DisanayakeOilCenter.dto.OrderRequestDto;
import DisanayakeOilCenter.model.*;
import DisanayakeOilCenter.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class OrderService {

    @Autowired
    private CustomerOrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomerAccountRepository customerRepository;

    @Transactional
    public CustomerOrder placeOrder(OrderRequestDto request) {
        CustomerOrder newOrder = new CustomerOrder();
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus("Pending");
        newOrder.setPayment(request.getPaymentMethod());

        // Link customer if they are logged in
        if (request.getUserId() != null) {
            CustomerAccount customer = customerRepository.findById(Long.valueOf(request.getUserId())).orElse(null);;
            newOrder.setCustomer(customer);
        }

        double totalAmount = 0.0;

        // Process each item from the React cart
        for (CartItemDto cartItem : request.getCartItems()) {
            Product product = productRepository.findById(Long.valueOf(cartItem.getProductId()))
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Optional: Check if stock is sufficient here
            if (product.getStock_quantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + product.getP_name());
            }

            CustomerOrderItem orderItem = new CustomerOrderItem();
            orderItem.setCustomerOrder(newOrder); // Link back to the parent order
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPriceAtOrder(product.getPrice()); // Lock in current price

            // Add to total
            totalAmount += (product.getPrice() * cartItem.getQuantity());

            // Deduct from inventory
            product.setStock_quantity(product.getStock_quantity() - cartItem.getQuantity());
            productRepository.save(product);

            newOrder.getOrderItems().add(orderItem);
        }

        newOrder.setTotalAmount(totalAmount);

        // Because we used CascadeType.ALL in CustomerOrder, saving the order
        // will automatically save all the associated CustomerOrderItems to the database!
        return orderRepository.save(newOrder);
    }
}
