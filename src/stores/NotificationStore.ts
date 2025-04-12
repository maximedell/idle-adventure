import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type NotificationType = "info" | "warning" | "danger" | "success" | "default";

type NotificationEntry = {
	id: number;
	message: string;
	type: NotificationType;
};

interface NotificationState {
	notifications: NotificationEntry[];
}

interface NotificationActions {
	addNotification(message: string, type: NotificationType): void;
	dismiss(id: number): void;
	dismissAll(): void;
}

interface NotificationStore extends NotificationState, NotificationActions {}

export const useNotificationStore = create<NotificationStore>()(
	subscribeWithSelector((set) => ({
		notifications: [],
		addNotification: (message: string, type: NotificationType) => {
			const id = Date.now();
			set((state) => ({
				notifications: [...state.notifications, { id, message, type }],
			}));
		},
		dismiss: (id: number) => {
			set((state) => ({
				notifications: state.notifications.filter((notif) => notif.id !== id),
			}));
		},
		dismissAll: () => {
			set({ notifications: [] });
		},
	}))
);
