import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/leaves'; // Update with your backend URL

export const leaveService = {
    // Get leave requests for a specific employee
    getEmployeeLeaves: async (employeeId) => {
        const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
        return response.data;
    },

    // Submit a new leave request
    submitLeave: async (leaveData) => {
        // leaveData expected: { employeeId, startDate, endDate, reason, leaveType }
        const response = await axios.post(`${API_BASE_URL}/apply`, leaveData);
        return response.data;
    },

    // Get all leaves (for Admin)
    getAllLeaves: async () => {
        const response = await axios.get(`${API_BASE_URL}/all`);
        return response.data;
    },

    // Update leave status (Approve/Reject + Admin Comment)
    updateLeaveStatus: async (leaveId, statusData) => {
        // statusData expected: { status: 'APPROVED' or 'REJECTED', adminComment }
        const response = await axios.put(`${API_BASE_URL}/${leaveId}/status`, statusData);
        return response.data;
    }
};