function LeaveBalance() {

    const leaveTypes = [
        {
            name: "Annual Leave",
            total: 14,
            used: 0
        },
        {
            name: "Casual Leave",
            total: 8,
            used: 0
        },
        {
            name: "Sick Leave",
            total: 8,
            used: 0
        },
        {
            name: "Other Leave",
            total: 5,
            used: 0
        }
    ];

    return (
        <div className="leave-balance">

            <h2>Leave Balance</h2>

            <div className="balance-grid">

                {leaveTypes.map((leave) => (

                    <div
                        className="balance-card"
                        key={leave.name}
                    >

                        <h3>{leave.name}</h3>

                        <p className="remaining">
                            {leave.total - leave.used}
                        </p>

                        <span>
                            Remaining out of {leave.total}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default LeaveBalance;