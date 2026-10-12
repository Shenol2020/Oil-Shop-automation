package DisanayakeOilCenter.service;

import DisanayakeOilCenter.model.AttendanceRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Service
public class SalaryService {

    private static final double BASE_SALARY = 30000;
    private static final double OVERTIME_RATE_PER_HOUR = 1000;
    private static final LocalTime SHIFT_START = LocalTime.of(8, 0);
    private static final LocalTime SHIFT_END = LocalTime.of(17, 0);

    /**
     * Computes overtime hours (full hours only) for a single day's record.
     */
    public long calculateOvertimeHours(AttendanceRecord record) {
        if (record.getArrivalTime() == null || record.getDepartureTime() == null) {
            return 0;
        }

        long earlyMinutes = 0;
        long lateMinutes = 0;

        LocalDateTime shiftStart = record.getArrivalTime().toLocalDate().atTime(SHIFT_START);
        LocalDateTime shiftEnd = record.getArrivalTime().toLocalDate().atTime(SHIFT_END);

        if (record.getArrivalTime().isBefore(shiftStart)) {
            earlyMinutes = ChronoUnit.MINUTES.between(record.getArrivalTime(), shiftStart);
        }
        if (record.getDepartureTime().isAfter(shiftEnd)) {
            lateMinutes = ChronoUnit.MINUTES.between(shiftEnd, record.getDepartureTime());
        }

        long totalOvertimeMinutes = earlyMinutes + lateMinutes;
        return totalOvertimeMinutes / 60; // full hours only
    }

    public double calculateTotalPay(AttendanceRecord record) {
        long overtimeHours = calculateOvertimeHours(record);
        return BASE_SALARY + (overtimeHours * OVERTIME_RATE_PER_HOUR);
    }
}