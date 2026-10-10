package DisanayakeOilCenter.service;

import DisanayakeOilCenter.dto.CartItemDto;
import DisanayakeOilCenter.dto.OrderRequestDto;
import DisanayakeOilCenter.model.*;
import DisanayakeOilCenter.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class OrderService {

    @Autowired
    private CustomerOrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OnlineCustomerRepository customerRepository;

    @Transactional
    public CustomerOrder placeOrder(OrderRequestDto request) {

        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart cannot be empty");
        }

        CustomerOrder newOrder = new CustomerOrder();
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus("Pending");
        newOrder.setPayment(request.getPaymentMethod());

        if (request.getUserId() != null) {
            OnlineCustomer customer = customerRepository
                    .findById(String.valueOf(request.getUserId()))
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            newOrder.setCustomer(customer);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItemDto cartItem : request.getCartItems()) {

            if (cartItem.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            Product product = productRepository
                    .findById(Integer.valueOf(cartItem.getProductId()))
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getCurrent_stock_quantity() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for: " + product.getP_name());
            }

            BigDecimal unitPrice = parseProductPrice(product);

            CustomerOrderItem orderItem = new CustomerOrderItem();
            orderItem.setCustomerOrder(newOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPriceAtOrder(unitPrice.doubleValue());

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            product.setCurrent_stock_quantity(
                    product.getCurrent_stock_quantity() - cartItem.getQuantity());

            productRepository.save(product);

            newOrder.getOrderItems().add(orderItem);
        }

        newOrder.setTotalAmount(totalAmount.doubleValue());

        return orderRepository.save(newOrder);
    }

    private BigDecimal parseProductPrice(Product product) {
        try {
            return new BigDecimal(product.getPrice());
        } catch (Exception e) {
            throw new RuntimeException("Invalid product price for product: " + product.getP_name(), e);
        }
    }
}