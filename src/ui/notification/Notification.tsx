import CloseIcon from "../../icons/shared/close.svg?react";
import SuccessIcon from "../../icons/shared/success.svg?react";
import WarningIcon from "../../icons/shared/warning.svg?react";
import DangerIcon from "../../icons/shared/danger.svg?react";
import InfoIcon from "../../icons/shared/info.svg?react";
import DefaultIcon from "../../icons/shared/default.svg?react";
import { useState, useEffect } from "react";

type NotificationType = "info" | "warning" | "danger" | "success" | "default";
type NotificationEntry = {
	id: number;
	message: string;
	type: NotificationType;
};
function getNotificationColor(type: NotificationType) {
	switch (type) {
		case "info":
			return CloseIcon;
		case "warning":
			return "text-yellow-800";
		case "danger":
			return "text-red-800";
		case "success":
			return "text-green-800";
		case "default":
			return "text-gray-800";
		default:
			return "text-gray-800";
	}
}
function getNotificationIcon(type: NotificationType) {
	switch (type) {
		case "info":
			return InfoIcon;
		case "warning":
			return WarningIcon;
		case "danger":
			return DangerIcon;
		case "success":
			return SuccessIcon;
		case "default":
			return DefaultIcon;
		default:
			return DefaultIcon;
	}
}

interface NotificationProps {
	notification: NotificationEntry;
	dismiss: (id: number) => void;
}

export default function Notification({
	notification,
	dismiss,
}: NotificationProps) {
	const [isVisible, setIsVisible] = useState(false);
	const Icon = getNotificationIcon(notification.type);
	const handleDismiss = () => {
		setIsVisible(false);
		setTimeout(() => {
			dismiss(notification.id);
		}, 300);
	};
	useEffect(() => {
		const fadeInTimer = setTimeout(() => {
			setIsVisible(true);
		}, 10);

		const autoDismissTimer = setTimeout(() => {
			handleDismiss();
		}, 3000);

		return () => {
			clearTimeout(fadeInTimer);
			clearTimeout(autoDismissTimer);
		};
	}, []);
	return (
		<div
			className={`transition-all duration-300 bg-primary text-primary-dark font-bold text-xs rounded shadow cursor-pointer text-center flex p-1 w-fit ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}
			onClick={handleDismiss}
		>
			<Icon
				className={`w-4 h-4 mr-2 fill-current ${getNotificationColor(
					notification.type
				)}`}
			/>
			{notification.message}
		</div>
	);
}
