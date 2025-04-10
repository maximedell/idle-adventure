import StatBar from "../shared/StatBar";
import { useGameStore } from "../../store/GameStore";
import { useMonsterStore } from "../../modules/monster/MonsterStore";

interface MonsterBoxProps {
	monsterUid?: string;
}

export default function MonsterBox({ monsterUid }: MonsterBoxProps) {
	const activeArea = useGameStore((state) => state.activeArea);
	if (!activeArea) return null;
	const handleClick = () => {
		activeArea.addMonster();
	};
	const stateClick = () => {
		console.log(useMonsterStore.getState());
	};
	if (monsterUid) {
		const monster = activeArea.getMonsterByUid(monsterUid);
		const health = useMonsterStore((state) => state.health[monsterUid]);
		const mana = useMonsterStore((state) => state.mana[monsterUid]);
		if (!monster) return null;
		return (
			<div className="box-monster">
				<h3>{monster.getName()}</h3>
				<StatBar
					stat={health}
					maxStat={monster.getStats().maxHealth}
					color="hp"
				/>
				{monster.getStats().maxMana > 0 && (
					<StatBar
						stat={mana}
						maxStat={monster.getStats().maxMana}
						color="mana"
					/>
				)}
				<button onClick={stateClick}>State</button>
			</div>
		);
	} else {
		return (
			<button className="box-monster" onClick={handleClick}>
				Ajouter un monster
			</button>
		);
	}
}
//
