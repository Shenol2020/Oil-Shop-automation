import { useEffect, useState } from "react";
import {
    getPendingLeaves,
    approveLeave,
    rejectLeave
} from "../api/leaveApi";

function AdminDashboard() {

    const [requests, setRequests] = useState([]);
    const [comment, setComment] = useState("");
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

    const handleApprove = async (id) => {
        try {
            await approveLeave(id, comment);

            alert("Leave request approved!");

            setComment("");

            loadRequests();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectLeave(id, comment);

            alert("Leave request rejected!");

            setComment("");

            loadRequests();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>

                <p>
                    Manage employee leave requests
                </p>
            </header>

            <div className="admin-card">

                <h2>Pending Leave Requests</h2>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {requests.length === 0 && !error && (
                    <p>No pending leave requests.</p>
                )}

                {requests.map((request) => (

                    <div
                        className="request-card"
                        key={request.id}
                    >

                        <h3>
                            Employee ID:{" "}
                            {request.employee?.id}
                        </h3>

                        <p>
                            <strong>Leave Type:</strong>{" "}
                            {request.leaveType}
                        </p>

                        <p>
                            <strong>Start Date:</strong>{" "}
                            {request.startDate}
                        </p>

                        <p>
                            <strong>End Date:</strong>{" "}
                            {request.endDate}
                        </p>

                        <p>
                            <strong>Reason:</strong>{" "}
                            {request.reason}
                        </p>

                        <textarea
                            placeholder="Admin comment"
                            value={comment}
                            onChange={(event) =>
                                setComment(event.target.value)
                            }
                        />

                        <div className="action-buttons">

                            <button
                                className="approve"
                                onClick={() =>
                                    handleApprove(request.id)
                                }
                            >
                                Approve
                            </button>

                            <button
                                className="reject"
                                onClick={() =>
                                    handleReject(request.id)
                                }
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