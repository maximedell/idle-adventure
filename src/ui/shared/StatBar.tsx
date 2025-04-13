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
		<div className="container-bar ">
			<p className="text-bar">
				{Math.floor(stat * 10) / 10}/{maxStat}
			</p>
			<div
				className={`${barColor} rounded h-full transition-all duration-300 ease-in-out`}
				style={{ width: barWidth + "%" }}
			></div>
		</div>
	);
}
