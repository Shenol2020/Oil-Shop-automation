
package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.dto.OrderRequestDto;
import DisanayakeOilCenter.model.CustomerOrder;
import DisanayakeOilCenter.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderRequestDto orderRequest) {
        try {
            CustomerOrder completedOrder = orderService.placeOrder(orderRequest);
            return ResponseEntity.ok(completedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}