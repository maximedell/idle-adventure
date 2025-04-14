import CloseIcon from "../../icons/shared/close.svg?react";
interface ModalWrapperProps {
	children: React.ReactNode;
	onClose: () => void;
}

export default function ModalWrapper({ children, onClose }: ModalWrapperProps) {
	return (
		<div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-primary h-fit rounded-lg shadow-lg p-6 w-3/5 relative text-primary-dark top-60">
				<button
					className="absolute top-2 right-2  hover:text-gray-700"
					onClick={onClose}
				>
					<CloseIcon className="w-6 h-6 fill-current" />
				</button>
				{children}
			</div>
		</div>
	);
}
