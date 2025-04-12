import StatBar from "../shared/StatBar";
import {
	useMonsterHealth,
	useMonsterMana,
	useActiveArea,
	useReviveTimer,
} from "../../selectors/MonsterSelector";
import SkillIcon from "../skill/SkillIcon";
import MonsterIcon from "./MonsterIcon";
import { useNotificationStore } from "../../stores/NotificationStore";
import { useBattleState } from "../../selectors/AreaSelector";

interface MonsterBoxProps {
	monsterUid?: string;
}

export default function MonsterBox({ monsterUid }: MonsterBoxProps) {
	const activeArea = useActiveArea();
	const health = useMonsterHealth(monsterUid);
	const mana = useMonsterMana(monsterUid);
	const reviveTimer = useReviveTimer(monsterUid);
	const battleState = useBattleState();

	if (!activeArea) return null;

	const handleClick = () => {
		if (battleState) {
			useNotificationStore
				.getState()
				.addNotification("Impossible pendant un combat!", "warning");
			return;
		}
		activeArea.addMonster();
	};

	if (monsterUid) {
		const monster = activeArea.getMonsterByUid(monsterUid);
		if (!monster) return null;
		const reviveTime = monster.getData().reviveTime;
		return (
			<div className="box-monster">
				<div className="flex flex-row items-center">
					<MonsterIcon monster={monster.getData()} className="w-8 h-8" />
					<h3>{monster.getName()}</h3>
				</div>

				<StatBar
					stat={health ? health : reviveTimer ? Math.floor(reviveTimer) : 0}
					maxStat={health ? monster.getStats().health : reviveTime}
					color={health ? "hp" : "exp"}
				/>
				{monster.getStats().mana > 0 && (
					<StatBar
						stat={mana ?? 0}
						maxStat={monster.getStats().mana}
						color="mana"
					/>
				)}
				<div className="flex flex-row gap-2 mt-1">
					{monster.getSkills().map((skill) => (
						<SkillIcon
							skill={skill}
							className="w-5 h-5"
							key={skill.id}
							monsterUid={monster.getUid()}
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<button className="box-monster" onClick={handleClick}>
			Ajouter un monster
		</button>
	);
}
