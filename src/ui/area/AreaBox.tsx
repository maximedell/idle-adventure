import {
	useActiveArea,
	useAreaMonsters,
	useBattleState,
} from "../../selectors/AreaSelector";
import { useGameStore } from "../../stores/GameStore";
import MonsterBox from "../monster/MonsterBox";
import FightIcon from "../../icons/shared/fight.svg?react";
import IdleIcon from "../../icons/shared/idle.svg?react";

type BattleState = "idle" | "fighting";

export default function AreaBox() {
	const activeArea = useActiveArea();
	if (!activeArea) return null;
	const battleState = useBattleState();
	const setBattleState = useGameStore((s) => s.setBattleState);
	const monsterUids = useAreaMonsters();
	const borderColor =
		battleState === "idle" ? "border-primary-light" : "border-accent";
	const Fight = FightIcon;
	const Idle = IdleIcon;
	const handleClick = (state: BattleState) => {
		if (state !== battleState) {
			setBattleState(state);
		}
	};
	return (
		<div className={`box-area relative ${borderColor}`}>
			<h2>{activeArea.getName()}</h2>
			<div className="absolute top-0 right-0 m-4">
				<button
					className={"w-8 h-8 border border-primary-dark rounded mr-4"}
					onClick={() => handleClick("fighting")}
				>
					<Fight
						className={`${
							battleState === "fighting" ? "text-accent" : "text-primary-dark"
						}
                        w-full h-full fill-current`}
					/>
				</button>
				<button
					className="w-8 h-8 border border-primary-dark rounded"
					onClick={() => handleClick("idle")}
				>
					<Idle
						className={`${
							battleState === "idle" ? "text-pimary-light" : "text-primary-dark"
						}
                        w-full h-full fill-current`}
					/>
				</button>
			</div>
			{monsterUids && monsterUids.length > 0 && (
				<ul className="grid grid-cols-5 gap-4 w-full mt-4">
					{monsterUids.map((monsterUid, index) => (
						<li key={index}>
							<MonsterBox monsterUid={monsterUid} />
						</li>
					))}
					{monsterUids.length < activeArea.maxMonsters && (
						<li>
							<MonsterBox />
						</li>
					)}
				</ul>
			)}
		</div>
	);
}
