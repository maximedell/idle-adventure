import { useBattleLog } from "../../selectors/GameSelector";
import { useState } from "react";
const logTypes = ["danger", "info", "success", "warning", "default"];

function getLogColor(type: string) {
	return (
		{
			danger: "text-accent",
			info: "text-blue-700",
			success: "text-green-700",
			warning: "text-yellow-700",
			default: "text-primary-light",
		}[type] || "text-primary-light"
	);
}
export default function BattleLog() {
	const battleLog = useBattleLog();
	if (!battleLog) return null;
	const [visibleTypes, setVisibleType] = useState<Record<string, boolean>>({
		danger: true,
		info: true,
		success: true,
		warning: true,
		default: true,
	});
	const toggleType = (type: string) => {
		setVisibleType((prev) => ({
			...prev,
			[type]: !prev[type],
		}));
	};

	const filteredLogs = battleLog
		.filter((log) => visibleTypes[log.type])
		.slice()
		.reverse();
	return (
		<div className="box-adventurer">
			<h2 className="mb-2 text-center">Battle Log</h2>
			<div className="flex flex-row gap-2">
				<div className="">
					{logTypes.map((type) => (
						<label
							key={type}
							className="text-sm text-white flex items-center gap-1"
						>
							<input
								type="checkbox"
								checked={visibleTypes[type]}
								onChange={() => toggleType(type)}
								className="accent-blue-500"
							/>
							<span className={getLogColor(type)}>{type}</span>
						</label>
					))}
				</div>
				<div className="flex-grow max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
					<ul className="list-none list-inside">
						{filteredLogs &&
							filteredLogs.map((log, index) => {
								const isFirst = index === 0;
								return (
									<li
										key={index}
										className={`${
											isFirst
												? "animate-fadeIn transition-opacity duration-300 opacity-0 "
												: ""
										} ${getLogColor(log.type)}`}
									>
										{log.message}
									</li>
								);
							})}
					</ul>
				</div>
			</div>
		</div>
	);
}
