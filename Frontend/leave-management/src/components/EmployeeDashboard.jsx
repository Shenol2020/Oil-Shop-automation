import LeaveBalance from "../components/LeaveBalance";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LeaveTable from "../components/LeaveTable";

function EmployeeDashboard() {

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Employee Dashboard</h1>

                    <p>
                        Manage your leave requests
                    </p>
                </div>

            </header>

            <LeaveBalance />

            <div className="dashboard-grid">

                <LeaveRequestForm />

                <LeaveTable />

            </div>

        </div>
    );
}

export default EmployeeDashboard;