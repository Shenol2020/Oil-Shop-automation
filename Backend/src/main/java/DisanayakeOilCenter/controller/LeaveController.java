package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.LeaveRequest;
import DisanayakeOilCenter.service.LeaveService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173"
})
@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }


    // ==========================================
    // EMPLOYEE REQUEST LEAVE
    // ==========================================

    @PostMapping("/request")
    public LeaveRequest requestLeave(
            @RequestBody LeaveRequest leaveRequest) {

        return leaveService.requestLeave(leaveRequest);
    }


    // ==========================================
    // ADMIN GET PENDING LEAVE REQUESTS
    // ==========================================

    @GetMapping("/pending")
    public List<LeaveRequest> getPendingLeaves() {

        return leaveService.getPendingLeaves();
    }


    // ==========================================
    // ADMIN APPROVE LEAVE
    // ==========================================

    @PutMapping("/approve/{id}")
    public LeaveRequest approveLeave(
            @PathVariable Long id,
            @RequestParam(required = false) String adminComment) {

        return leaveService.approveLeave(
                id,
                adminComment
        );
    }


    // ==========================================
    // ADMIN REJECT LEAVE
    // ==========================================

    @PutMapping("/reject/{id}")
    public LeaveRequest rejectLeave(
            @PathVariable Long id,
            @RequestParam(required = false) String adminComment) {

        return leaveService.rejectLeave(
                id,
                adminComment
        );
    }
}