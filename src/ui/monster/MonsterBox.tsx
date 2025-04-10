import StatBar from "../shared/StatBar";
import { useGameStore } from "../../store/GameStore";
import { useMonsterStore } from "../../store/MonsterStore";

interface MonsterBoxProps {
	monsterUid?: string;
}

export default function MonsterBox({ monsterUid }: MonsterBoxProps) {
	const activeArea = useGameStore((state) => state.activeArea);
	const health = useMonsterStore((state) =>
		monsterUid ? state.health[monsterUid] : undefined
	);
	const mana = useMonsterStore((state) =>
		monsterUid ? state.mana[monsterUid] : undefined
	);
	const reviveTimer = useMonsterStore((state) =>
		monsterUid ? state.reviveBuffer[monsterUid] : undefined
	);

	if (!activeArea) return null;

	const handleClick = () => {
		activeArea.addMonster();
	};

	const stateClick = () => {
		console.log(useMonsterStore.getState());
	};

	if (monsterUid) {
		const monster = activeArea.getMonsterByUid(monsterUid);
		if (!monster) return null;
		const reviveTime = monster.getData().reviveTime;
		return (
			<div className="box-monster">
				<h3>{monster.getName()}</h3>
				<StatBar
					stat={health ? health : reviveTimer ? Math.floor(reviveTimer) : 0}
					maxStat={health ? monster.getStats().maxHealth : reviveTime}
					color={health ? "hp" : "exp"}
				/>
				{monster.getStats().maxMana > 0 && (
					<StatBar
						stat={mana ?? 0}
						maxStat={monster.getStats().maxMana}
						color="mana"
					/>
				)}
			</div>
		);
	}

	return (
		<button className="box-monster" onClick={handleClick}>
			Ajouter un monster
		</button>
	);
}
