import { useEffect, useState } from "react";
import { monsterIcons } from "../../icons/monsters";
import { MonsterData } from "../../types/monster";
interface MonsterIconProps {
	monster: MonsterData;
	className?: string;
}

export default function MonsterIcon({ monster, className }: MonsterIconProps) {
	const [Icon, setIcon] = useState<React.FC<
		React.SVGProps<SVGSVGElement>
	> | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const loadIcon = async () => {
			const icon = await monsterIcons[monster.id];
			if (icon) {
				setIcon(() => icon);
			} else {
				console.error("Monster icon not found: " + monster.id);
			}
			setLoading(false);
		};
		loadIcon();
	}, [monster.id]);

	if (loading) return <div className="w-8 h-8 animate-pulse" />;
	return (
		<div
			className={`flex flex-col items-center text-primary-light ${className}`}
		>
			{Icon && <Icon className="w-full h-full fill-current" />}
		</div>
	);
}
