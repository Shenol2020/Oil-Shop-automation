import { useState } from "react";
import { submitLeaveRequest } from "../api/leaveApi";

function LeaveRequestForm() {

    const [formData, setFormData] = useState({
        employeeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "ANNUAL"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            await submitLeaveRequest(formData);

            setMessage("Leave request submitted successfully!");

            // Clear form
            setFormData({
                employeeId: "",
                startDate: "",
                endDate: "",
                reason: "",
                leaveType: "ANNUAL"
            });

        } catch (error) {
            console.error("Leave request error:", error);
            setError(error.message);
        }
    };

    return (
        <div className="form-card">
            <h2>Request Leave</h2>

            {/* SUCCESS MESSAGE */}
            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* EMPLOYEE ID */}
                <label>Employee ID</label>
                <input
                    type="number"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                />

                {/* START DATE */}
                <label>Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />

                {/* END DATE */}
                <label>End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />

                {/* LEAVE TYPE */}
                <label>Leave Type</label>
                <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                >
                    <option value="ANNUAL">Annual Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="OTHER">Other Leave</option>
                </select>

                {/* REASON */}
                <label>Reason</label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for leave"
                    rows="4"
                    required
                />

                {/* SUBMIT BUTTON */}
                <button type="submit">
                    Submit Request
                </button>
            </form>
        </div>
    );
}

export default LeaveRequestForm;