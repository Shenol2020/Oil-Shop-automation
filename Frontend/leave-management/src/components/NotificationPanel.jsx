
import { useEffect, useState, useCallback } from "react";

import {
    getEmployeeNotifications,
    markNotificationAsRead
} from "../api/notificationApi";

function NotificationPanel() {

    const [employeeId, setEmployeeId] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadNotifications = useCallback(async () => {
        if (!employeeId.trim()) {
            setNotifications([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data =
                await getEmployeeNotifications(employeeId.trim());

            setNotifications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    // Load notifications and refresh every 5 seconds
    useEffect(() => {
        if (!employeeId.trim()) {
            setNotifications([]);
            return;
        }

        loadNotifications();

        const intervalId = setInterval(() => {
            loadNotifications();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [employeeId, loadNotifications]);

    // Mark notification as read
    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            await loadNotifications();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="notification-panel">

            <h2>
                Notifications (
                {notifications.filter(
                    notification => !notification.isRead
                ).length}
                )
            </h2>

            <label htmlFor="employeeNotificationId">
                Employee ID
            </label>

            <input
                id="employeeNotificationId"
                type="text"
                value={employeeId}
                onChange={(event) =>
                    setEmployeeId(event.target.value)
                }
                placeholder="Enter your employee ID"
            />

            {loading && <p>Loading notifications...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {employeeId.trim() &&
                !loading &&
                !error &&
                notifications.length === 0 && (
                    <p>No notifications yet.</p>
                )}

            {notifications.map((notification) => (

                <div
                    key={notification.id}
                    className={`notification-item ${
                        notification.isRead ? "read" : "unread"
                    }`}
                >

                    <p>{notification.message}</p>

                    {notification.createdAt && (
                        <small>
                            {new Date(
                                notification.createdAt
                            ).toLocaleString()}
                        </small>
                    )}

                    {!notification.isRead && (
                        <button
                            type="button"
                            onClick={() =>
                                handleMarkAsRead(notification.id)
                            }
                        >
                            Mark as read
                        </button>
                    )}

                </div>
            ))}

        </div>
    );
}

export default NotificationPanel;