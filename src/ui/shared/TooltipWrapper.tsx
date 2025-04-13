import { useState } from "react";

interface TooltipWrapperProps {
	children: React.ReactNode;
	className?: string;
	tooltipContent: React.ReactNode;
	tooltipClassName?: string;
}

export default function TooltipWrapper({
	children,
	className = "",
	tooltipContent,
	tooltipClassName = "",
}: TooltipWrapperProps) {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<div
			className={`relative cursor-default ${className}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}
			{isHovered && (
				<div
					className={`pointer-events-none absolute z-10 bg-primary-dark text-primary-light p-2 border border-primary rounded-lg shadow-md flex flex-col w-fit ${tooltipClassName}`}
				>
					{tooltipContent}
				</div>
			)}
		</div>
	);
}
