import StatBar from "../shared/StatBar";
import {
	useMonsterHealth,
	useMonsterMana,
	useReviveTimer,
} from "../../selectors/MonsterSelector";
import SkillIcon from "../skill/SkillIcon";
import MonsterIcon from "./MonsterIcon";
import { useNotificationStore } from "../../stores/NotificationStore";
import { useBattleState } from "../../selectors/AreaSelector";
import TooltipWrapper from "../shared/TooltipWrapper";
import SkillTooltip from "../skill/SkillTooltip";
import MonsterTooltip from "./MonsterTooltip";
import { useArea } from "../../selectors/GameSelector";

interface MonsterBoxProps {
	monsterUid?: string;
}

export default function MonsterBox({ monsterUid }: MonsterBoxProps) {
	const activeArea = useArea();
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
			<div className="bg-primary-dark shadow-md border-accent border rounded-lg p-3 w-full h-full">
				<div className="flex flex-row justify-center cursor-default w-full">
					<TooltipWrapper
						tooltipContent={<MonsterTooltip monster={monster} className="" />}
					>
						<MonsterIcon monster={monster.getData()} className="w-8 h-8" />
					</TooltipWrapper>
				</div>

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
				<div className="flex flex-row gap-2 mt-1">
					{monster.getSkills().map((skill) => (
						<TooltipWrapper
							key={skill.id}
							tooltipContent={<SkillTooltip skill={skill} owner={monster} />}
						>
							<SkillIcon
								skill={skill}
								className="w-5 h-5"
								key={skill.id}
								monsterUid={monster.getUid()}
							/>
						</TooltipWrapper>
					))}
				</div>
			</div>
		);
	}

	return (
		<button
			className="bg-primary-dark shadow-md border-accent border rounded-lg p-3 w-full h-full"
			onClick={handleClick}
		>
			Chercher plus de monstre
		</button>
	);
}
