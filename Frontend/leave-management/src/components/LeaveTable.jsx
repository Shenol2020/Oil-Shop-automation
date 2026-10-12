import { useState, useEffect } from "react";

function LeaveTable() {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8081/api/leaves/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Backend Data:", data);
                setRequests(data); // Store the real data in our state
            })
            .catch((error) => console.error("Error fetching leaves:", error));
    }, []);


    return (
        <div className="table-card">

            <h2>My Leave Requests</h2>

            <table>

                <thead>
                <tr>
                    <th>Leave Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>

                {requests.map((request) => (

                    <tr key={request.id}>

                        <td>
                            {request.leaveType}
                        </td>

                        <td>
                            {request.startDate}
                        </td>

                        <td>
                            {request.endDate}
                        </td>

                        <td>
                            <span
                                className={`status ${request.leaveStatus?.toLowerCase() || ""}`}
                            >
                                {request.leaveStatus || "UNKNOWN"}
                            </span>
                        </td>
                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}

export default LeaveTable;