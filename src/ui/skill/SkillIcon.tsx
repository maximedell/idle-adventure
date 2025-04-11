import { skill } from "../../types/skill";
import { skillIcons } from "../../icons/skills";
import { useAdventurerSkillCooldown } from "../../selectors/AdventurerSelector";
import { useMonsterSkillCooldown } from "../../selectors/MonsterSelector";
import { useId } from "react";

interface SkillIconProps {
	skill: skill;
	className?: string;
	monsterUid?: string;
}
type SkillState = "active" | "cooldown" | "disabled";
export default function SkillIcon({
	skill,
	className,
	monsterUid,
}: SkillIconProps) {
	const cooldown = monsterUid
		? useMonsterSkillCooldown(monsterUid, skill.id)
		: useAdventurerSkillCooldown(skill.id);
	const maxCooldown = skill.cooldown;
	const Icon = skillIcons[skill.id];
	const state: SkillState = cooldown === 0 ? "active" : "cooldown";
	const skillColor =
		{
			active: "text-primary-light",
			cooldown: "text-accent",
		}[state] || "text-gray-500"; // Default color if not found

	return (
		<div
			className={`relative flex items-center justify-center ${skillColor} ${className} rounded border border-primary`}
		>
			{Icon && <Icon className="w-full h-full fill-current" />}
			{cooldown > 0 && (
				<CooldownOverlaySquare percentage={cooldown / maxCooldown} />
			)}
		</div>
	);
}

export function CooldownOverlaySquare({ percentage }: { percentage: number }) {
	const maskId = useId(); // ← unique à chaque skill icon
	const clamped = Math.max(0, Math.min(1, percentage));
	const angle = clamped * 2 * Math.PI;

	const x = 50 + 50 * Math.sin(angle);
	const y = 50 - 50 * Math.cos(angle);
	const largeArc = clamped > 0.5 ? 1 : 0;

	const path = `M50,50 L50,0 A50,50 0 ${largeArc} 1 ${x},${y} Z`;

	return (
		<svg
			viewBox="0 0 100 100"
			className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
			preserveAspectRatio="none"
		>
			<defs>
				<mask id={maskId}>
					<rect x="0" y="0" width="100" height="100" fill="black" />
					<path d={path} fill="white" />
				</mask>
			</defs>
			<rect
				x="0"
				y="0"
				width="100"
				height="100"
				fill="rgba(0,0,0,0.6)"
				mask={`url(#${maskId})`}
			/>
		</svg>
	);
}
