import { use } from "react";
import { useAreaStore } from "../../store/AreaStore";
import { useGameStore } from "../../store/GameStore";
import MonsterBox from "../monster/MonsterBox";

type BattleState = "idle" | "fighting";

export default function AreaBox() {
	const activeArea = useGameStore((state) => state.activeArea);
	const activeAreaId = useAreaStore((state) => state.activeArea);
	if (!activeArea) return null;
	const battleState = useAreaStore((state) => state.battleState);
	const monsterUids = useAreaStore(
		(state) => state.monstersByArea[activeAreaId]
	); // Récupère les monstres depuis le store
	const borderColor =
		battleState === "idle" ? "border-primary-light" : "border-accent";
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = e.target.value;
		useAreaStore.getState().setBattleState(selectedValue as BattleState);
	};
	return (
		<div className={`box-area relative ${borderColor}`}>
			<h2>{activeArea.getName()}</h2>
			<div className="absolute top-0 right-0 m-4">
				<select
					className="select select-bordered select-rounded rounded w-full max-w-xs bg-primary-light text-primary-dark"
					value={battleState}
					onChange={handleChange}
				>
					<option value="idle">Inactif</option>
					<option value="fighting">Combattre</option>
				</select>
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
