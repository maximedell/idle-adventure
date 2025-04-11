import { monsterIcons } from "../../icons/monsters";
import { monster } from "../../types/monster";
interface MonsterIconProps {
	monster: monster;
	className?: string;
}

export default function MonsterIcon({ monster, className }: MonsterIconProps) {
	const Icon = monsterIcons[monster.id];

	return (
		<div
			className={`flex flex-col items-center text-primary-light ${className}`}
		>
			{Icon && <Icon className="w-full h-full fill-current" />}
		</div>
	);
}
