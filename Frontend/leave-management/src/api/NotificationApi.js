
const API_URL = "http://localhost:8081/api/notifications";

// Get notifications for an employee
export async function getEmployeeNotifications(userId) {
    const response = await fetch(
        `${API_URL}/employee/${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load notifications.");
    }

    return response.json();
}

// Mark a notification as read
export async function markNotificationAsRead(id) {
    const response = await fetch(
        `${API_URL}/${id}/read`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark notification as read.");
    }

    return response.json();
}