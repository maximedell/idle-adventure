import { useBattleLog } from "../../selectors/GameSelector";

function getLogColor(type: string) {
	return (
		{
			danger: "text-accent",
			info: "text-primary-light",
			success: "text-green-700",
			warning: "text-yellow-700",
		}[type] || "text-primary-light"
	);
}
export default function BattleLog() {
	const battleLog = useBattleLog();
	return (
		<div className="box-adventurer">
			<h2 className="text-white text-lg font-bold mb-2">Battle Log</h2>
			<div className="flex-grow max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
				<ul className="list-disc list-inside">
					{battleLog &&
						battleLog
							.slice()
							.reverse()
							.map((log, index) => {
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
	);
}
