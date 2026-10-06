import { useState } from "react";

import EmployeeDashboard from "./components/EmployeeDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {

    // Temporary role for testing
    const [role, setRole] = useState("EMPLOYEE");

    return (
        <div>

            {/* Temporary role buttons */}
            <div className="role-switcher">
                <button onClick={() => setRole("EMPLOYEE")}>
                    Employee
                </button>

                <button onClick={() => setRole("ADMIN")}>
                    Admin
                </button>
            </div>

            {role === "EMPLOYEE" && <EmployeeDashboard />}

            {role === "ADMIN" && <AdminDashboard />}

        </div>
    );
}

export default App;