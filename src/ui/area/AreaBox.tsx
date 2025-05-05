import {
	useActiveAreaId,
	useBattleState,
	useMaxMontersPerArea,
	useMonstersByArea,
} from "../../selectors/AreaSelector";
import { useGameStore } from "../../stores/GameStore";
import MonsterBox from "../monster/MonsterBox";
import FightIcon from "../../icons/shared/fight.svg?react";
import { useArea, useIsInCombat } from "../../selectors/GameSelector";
import { useNotificationStore } from "../../stores/NotificationStore";

export default function AreaBox() {
	const activeArea = useArea();
	const areaId = useActiveAreaId();
	const monstersByArea = useMonstersByArea();
	const maxMonstersByArea = useMaxMontersPerArea();
	const monsterUids = areaId ? monstersByArea[areaId] : [];
	const maxMonsters = areaId ? maxMonstersByArea[areaId] : 0;
	const battleState = useBattleState();
	const isInCombat = useIsInCombat();
	const setBattleState = useGameStore((s) => s.setBattleState);
	const borderColor = battleState ? "border-accent" : "border-primary-light";

	const handleClick = () => {
		if (isInCombat) {
			useNotificationStore
				.getState()
				.addNotification("Impossible pendant un combat!", "warning");
			return;
		}
		setBattleState(!battleState);
	};
	console.log("AreaBox", areaId, activeArea);
	if (!areaId || !activeArea) return null;

	return (
		<div className={`box-content flex flex-col items-center relative`}>
			<h2>{activeArea.getName()}</h2>
			<div className="absolute top-0 right-0 m-4 text-primary-light">
				<button className={"w-8 h-8 rounded"} onClick={() => handleClick()}>
					<FightIcon
						className={`${borderColor} w-full h-full fill-current border rounded`}
					/>
				</button>
			</div>
			{!activeArea.isBossArea() && monsterUids && monsterUids.length > 0 && (
				<ul className="grid grid-cols-5 gap-4 w-full mt-4 p-0">
					{monsterUids.map((monsterUid, index) => (
						<li key={index}>
							<MonsterBox monsterUid={monsterUid} />
						</li>
					))}
					{monsterUids.length < maxMonsters && (
						<li>
							<MonsterBox />
						</li>
					)}
				</ul>
			)}
			{activeArea.isBossArea() && monsterUids && (
				<div className="grid grid-cols-1 gap-4 w-full mt-4">
					<MonsterBox monsterUid={monsterUids[0]} />
				</div>
			)}
		</div>
	);
}
