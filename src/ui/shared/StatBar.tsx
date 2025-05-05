import { MathUtil } from "../../utils/MathUtil";

interface StatBarProps {
	stat: number;
	maxStat: number;
	color: string;
}

export default function StatBar({ stat, maxStat, color }: StatBarProps) {
	const barWidth = Math.min(100, (stat / maxStat) * 100);
	const barColor =
		{
			hp: "bg-red-600",
			mana: "bg-blue-600",
			exp: "bg-blue-300",
		}[color] || "bg-gray-300"; // Default color if not found
	return (
		<div className="bg-primary-light flex w-full h-4 rounded relative mt-2">
			<p className="text-primary-dark absolute left-1/2 -translate-x-1/2  text-xs font-bold">
				{MathUtil.floorTo(stat, 1)}/{maxStat}
			</p>
			<div
				className={`${barColor} rounded h-full transition-all duration-300 ease-in-out`}
				style={{ width: barWidth + "%" }}
			></div>
		</div>
	);
}
