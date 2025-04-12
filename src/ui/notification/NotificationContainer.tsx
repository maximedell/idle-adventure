import { useNotificationStore } from "../../stores/NotificationStore";
import Notification from "./Notification";

export default function NotificationContainer() {
	const { notifications, dismiss, dismissAll } = useNotificationStore();

	if (notifications.length === 0) return null;

	return (
		<div className="fixed top-[3.2rem] left-1/2 transform -translate-x-1/2 z-50 space-y-1 w-full max-w-md flex flex-col items-center">
			{notifications.map((notif) => (
				<Notification key={notif.id} notification={notif} dismiss={dismiss} />
			))}
		</div>
	);
}
