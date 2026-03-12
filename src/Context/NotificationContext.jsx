import { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Ui/Notification";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notif, setNotif] = useState({ show: false, type: "success", message: "" });

    const notify = useCallback(({ type = "success", message = "" }) => {
        setNotif({ show: true, type, message });
    }, []);

    const closeNotif = useCallback(() => {
        setNotif(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <NotificationContext.Provider value={{ notif, setNotif, notify }}>
            {children}
            {notif.show && (
                <Notification
                    type={notif.type}
                    message={notif.message}
                    onClose={closeNotif}
                />
            )}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};
