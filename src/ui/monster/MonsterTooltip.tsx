import { Adventurer } from "../../modules/Adventurer";
import { Monster } from "../../modules/Monster";
import { useAdventurerCombatStats } from "../../selectors/AdventurerSelector";
import { RewardSystem } from "../../systems/RewardSystem";

interface MonsterTooltipProps {
	monster: Monster;
	className?: string;
}

export default function MonsterTooltip({
	monster,
	className = "",
}: MonsterTooltipProps) {
	const data = monster.getData();
	const stats = monster.getStats();
	const adventurerLevel = useAdventurerCombatStats().level;
	return (
		<div className={`${className} tooltip-container`}>
			<span className="name">{data.name}</span>
			<span className="description">Niveau: {stats.level}</span>
			<span className="description">
				XP calculé:{" "}
				{RewardSystem.getRewardedExperience(
					adventurerLevel,
					monster.getLevel(),
					data.rewards.experience
				)}
			</span>
			{stats.strength > 0 && (
				<span className="description">Force: {stats.strength}</span>
			)}
			{stats.dexterity > 0 && (
				<span className="description">Dextérité: {stats.dexterity}</span>
			)}
			{stats.intelligence > 0 && (
				<span className="description">Intelligence: {stats.intelligence}</span>
			)}
		</div>
	);
}
