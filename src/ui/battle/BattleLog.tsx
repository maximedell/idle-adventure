import { useBattleLog } from "../../selectors/GameSelector";
import { useState } from "react";
const logTypes = ["danger", "info", "success", "warning", "default"];

function getBgLogColor(type: string) {
	return (
		{
			danger: "bg-accent",
			info: "bg-blue-700",
			success: "bg-green-700",
			warning: "bg-yellow-700",
			default: "bg-primary-light",
		}[type] || "text-primary-light"
	);
}
function getTextLogColor(type: string) {
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
	const groupedLogs = filteredLogs.reduce<
		{ message: string; type: string; count: number }[]
	>((acc, log) => {
		const last = acc[acc.length - 1];
		if (last && last.message === log.message && last.type === log.type) {
			// Incrémenter le compteur si le message est identique
			last.count += 1;
		} else {
			// Ajouter un nouveau log
			acc.push({ ...log, count: 1 });
		}
		return acc;
	}, []);
	return (
		<div className="box-adventurer">
			<h2 className="mb-2 text-center">Battle Log</h2>
			<div className="flex flex-row gap-2">
				<div className="">
					{logTypes.map((type) => (
						<label
							key={type}
							className={`text-sm text-white flex items-center p-1 relative`}
						>
							<input
								type="checkbox"
								checked={visibleTypes[type]}
								onChange={() => toggleType(type)}
								className={`peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md ${getBgLogColor(
									type
								)}`}
								id="check1"
							/>
							<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5"
									viewBox="0 0 20 20"
									fill="currentColor"
									stroke="currentColor"
									strokeWidth="1"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									></path>
								</svg>
							</span>
						</label>
					))}
				</div>
				<div className="flex-grow max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
					<ul className="list-none list-inside">
						{groupedLogs &&
							groupedLogs.map((log, index) => {
								const isFirst = index === 0;
								return (
									<li
										key={index}
										className={`${
											isFirst
												? "animate-fadeIn transition-all duration-300 opacity-0 "
												: ""
										} ${getTextLogColor(log.type)}`}
									>
										{log.message}
										{log.count > 1 && ` (x${log.count})`}
									</li>
								);
							})}
					</ul>
				</div>
			</div>
		</div>
	);
}
