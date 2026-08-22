package DisanayakeOilCenter.controller;

import DisanayakeOilCenter.model.AttendanceRecord;
import DisanayakeOilCenter.repository.AttendanceRepository;
import DisanayakeOilCenter.repository.UserRepository;
import DisanayakeOilCenter.service.SalaryService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final SalaryService salaryService;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                UserRepository userRepository,
                                SalaryService salaryService) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.salaryService = salaryService;
    }

    // Called every time a QR code is scanned. First scan of the day = arrival,
    // second scan = departure.
    @PostMapping("/scan")
    public Map<String, Object> scan(@RequestBody Map<String, String> body) {
        UUID userId = UUID.fromString(body.get("userId"));

        if (userRepository.findById(userId).isEmpty()) {
            throw new RuntimeException("Unknown user QR code");
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
    public AttendanceRecord getToday(@PathVariable UUID userId) {
        return attendanceRepository.findByUserIdAndWorkDate(userId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No record today"));
    }
}