package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.AttendanceRecord;
import DisanayakeOilCenter.repository.AttendanceRepository;
import DisanayakeOilCenter.repository.ShopStaffRepository;
import DisanayakeOilCenter.service.SalaryService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final ShopStaffRepository shopStaffRepository;
    private final SalaryService salaryService;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                ShopStaffRepository shopStaffRepository,
                                SalaryService salaryService) {
        this.attendanceRepository = attendanceRepository;
        this.shopStaffRepository = shopStaffRepository;
        this.salaryService = salaryService;
    }

    @PostMapping("/scan")
    public Map<String, Object> scan(@RequestBody Map<String, String> body) {
        // Read as String directly
        String userId = body.get("userId");

        if (shopStaffRepository.findById(userId).isEmpty()) {
            throw new RuntimeException("Unknown staff QR code");
        }

        LocalDate today = LocalDate.now();
        Optional<AttendanceRecord> existing =
                attendanceRepository.findByUserIdAndWorkDate(userId, today);

        AttendanceRecord record;
        String action;

        if (existing.isEmpty()) {
            record = new AttendanceRecord();
            record.setUserId(userId);
            record.setWorkDate(today);
            record.setArrivalTime(LocalDateTime.now());
            action = "ARRIVAL";
        } else {
            record = existing.get();
            if (record.getDepartureTime() != null) {
                throw new RuntimeException("Already checked out today");
            }
            record.setDepartureTime(LocalDateTime.now());
            action = "DEPARTURE";
        }

        record = attendanceRepository.save(record);

        double pay = record.getDepartureTime() != null
                ? salaryService.calculateTotalPay(record)
                : 0;

        return Map.of(
                "action", action,
                "record", record,
                "totalPay", pay
        );
    }

    @GetMapping("/today/{userId}")
    public AttendanceRecord getToday(@PathVariable String userId) {
        return attendanceRepository.findByUserIdAndWorkDate(userId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No record today"));
    }
}