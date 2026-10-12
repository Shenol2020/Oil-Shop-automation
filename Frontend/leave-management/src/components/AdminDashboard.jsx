import { useEffect, useState } from "react";
import {
    getPendingLeaves,
    approveLeave,
    rejectLeave
} from "../api/leaveApi";

function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [comments, setComments] = useState({});
    const [error, setError] = useState("");

    const loadRequests = async () => {
        try {
            setError("");
            const data = await getPendingLeaves();
            setRequests(data);
        } catch (error) {
            console.error("Error loading leaves:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id, index) => {
        try {
            const requestComment = comments[index] || "";
            await approveLeave(id, requestComment);

            alert("Leave request approved!");

            setComments((prev) => ({ ...prev, [index]: "" }));
            loadRequests();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleReject = async (id, index) => {
        try {
            const requestComment = comments[index] || "";
            await rejectLeave(id, requestComment);

            alert("Leave request rejected!");

            setComments((prev) => ({ ...prev, [index]: "" }));
            loadRequests();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleCommentChange = (index, value) => {
        setComments((prev) => ({
            ...prev,
            [index]: value
        }));
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage employee leave requests</p>
            </header>

            <div className="admin-card">
                <h2>Pending Leave Requests</h2>

                {error && <p className="error-message">{error}</p>}

                {requests.length === 0 && !error && (
                    <p>No pending leave requests.</p>
                )}

                {requests.map((request, index) => (
                    <div className="request-card" key={index}>
                        <h3>Employee ID: {request.employee?.id}</h3>
                        <p><strong>Leave Type:</strong> {request.leaveType}</p>
                        <p><strong>Start Date:</strong> {request.startDate}</p>
                        <p><strong>End Date:</strong> {request.endDate}</p>
                        <p><strong>Reason:</strong> {request.reason}</p>

                        <textarea
                            placeholder="Admin comment"
                            value={comments[index] || ""}
                            onChange={(event) =>
                                handleCommentChange(index, event.target.value)
                            }
                        />

                        <div className="action-buttons">
                            <button
                                className="approve"
                                onClick={() => handleApprove(request.id, index)}
                            >
                                Approve
                            </button>

                            <button
                                className="reject"
                                onClick={() => handleReject(request.id, index)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;