const API_URL = "http://localhost:8081/api/leaves";

export async function submitLeaveRequest(leaveData) {

    const requestData = {
        employee: {
            userId: Number(leaveData.employeeId) // FIXED: changed from 'id' to 'userId'
        },
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        leaveType: leaveData.leaveType
    };

    console.log(
        "SENDING TO BACKEND:",
        JSON.stringify(requestData, null, 2)
    );

    const response = await fetch(
        `${API_URL}/request`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        }
    );

    const responseText = await response.text();

    console.log("BACKEND STATUS:", response.status);
    console.log("BACKEND RESPONSE:", responseText);

    if (!response.ok) {
        throw new Error(
            `Backend error ${response.status}: ${responseText}`
        );
    }

    return responseText;
}

/*
    ADMIN
    GET PENDING LEAVE REQUESTS
*/
export async function getPendingLeaves() {
    const response = await fetch(`${API_URL}/pending`);
    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Backend error ${response.status}: ${responseText}`
        );
    }

    return JSON.parse(responseText);
}

/*
    ADMIN
    APPROVE LEAVE
*/
export async function approveLeave(id, comment) {
    const response = await fetch(
        `${API_URL}/approve/${id}?adminComment=${encodeURIComponent(comment)}`,
        { method: "PUT" }
    );
    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Backend error ${response.status}: ${responseText}`
        );
    }

    return responseText;
}

/*
    ADMIN
    REJECT LEAVE
*/
export async function rejectLeave(id, comment) {
    const response = await fetch(
        `${API_URL}/reject/${id}?adminComment=${encodeURIComponent(comment)}`,
        { method: "PUT" }
    );
    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Backend error ${response.status}: ${responseText}`
        );
    }

    return responseText;
}