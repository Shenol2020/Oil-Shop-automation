function LeaveTable() {

    const requests = [
        {
            id: 1,
            type: "Annual",
            startDate: "2026-10-01",
            endDate: "2026-10-03",
            status: "PENDING"
        },
        {
            id: 2,
            type: "Sick",
            startDate: "2026-09-10",
            endDate: "2026-09-11",
            status: "APPROVED"
        }
    ];

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
                            {request.type}
                        </td>

                        <td>
                            {request.startDate}
                        </td>

                        <td>
                            {request.endDate}
                        </td>

                        <td>
                                <span
                                    className={`status ${request.status.toLowerCase()}`}
                                >
                                    {request.status}
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