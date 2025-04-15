import {
	useActiveArea,
	useAreaMonsters,
	useBattleState,
} from "../../selectors/AreaSelector";
import { useGameStore } from "../../stores/GameStore";
import MonsterBox from "../monster/MonsterBox";
import FightIcon from "../../icons/shared/fight.svg?react";
import { useIsInCombat } from "../../selectors/GameSelector";
import { useNotificationStore } from "../../stores/NotificationStore";

export default function AreaBox() {
	const activeArea = useActiveArea();
	const battleState = useBattleState();
	const isInCombat = useIsInCombat();
	const setBattleState = useGameStore((s) => s.setBattleState);
	const monsterUids = useAreaMonsters();
	if (!activeArea) return null;
	const borderColor = battleState ? "border-accent" : "border-primary-light";
	const Fight = FightIcon;
	const handleClick = () => {
		if (isInCombat) {
			useNotificationStore
				.getState()
				.addNotification("Impossible pendant un combat!", "warning");
			return;
		}
		setBattleState(!battleState);
	};
	return (
		<div className={`box-content flex flex-col items-center relative`}>
			<h2>{activeArea.getName()}</h2>
			<div className="absolute top-0 right-0 m-4 text-primary-light">
				<button className={"w-8 h-8 rounded"} onClick={() => handleClick()}>
					<Fight
						className={`${borderColor} w-full h-full fill-current border rounded`}
					/>
				</button>
			</div>
			{!activeArea.isBossArea() && monsterUids && monsterUids.length > 0 && (
				<ul className="grid grid-cols-5 gap-4 w-full mt-4">
					{monsterUids.map((monsterUid, index) => (
						<li key={index}>
							<MonsterBox monsterUid={monsterUid} />
						</li>
					))}
					{monsterUids.length < activeArea.getSize() && (
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
