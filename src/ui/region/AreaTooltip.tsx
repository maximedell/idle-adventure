import { DataUtil } from "../../utils/DataUtil";
import { AreaData } from "../../types/area";
import { useEffect, useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";
import { MonsterData } from "../../types/monster";
interface AreaTooltipProps {
	areaId: string;
	className?: string;
	isLocked: boolean;
}

export default function AreaTooltip({
	areaId,
	className,
	isLocked,
}: AreaTooltipProps) {
	const [area, setArea] = useState<AreaData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [monsters, setMonsters] = useState<MonsterData[]>([]);

	useEffect(() => {
		const fetchAll = async () => {
			const areaData = await DataUtil.getAreaById(areaId);
			setArea(areaData);
			if (!areaData) return;

			const monsterData = await Promise.all(
				areaData.monsterIds?.map(async (monsterId) => {
					const monster = await DataUtil.getMonsterById(monsterId);
					return monster;
				}) || []
			);
			setMonsters(monsterData);
			setIsLoading(false);
		};
		fetchAll();
	}, [areaId]);

	if (isLoading) {
		return <LoadingSpinner />;
	}
	if (!area) return null;
	if (isLocked) {
		return (
			<div className={`${className}`}>
				<p className="text-sm">Conditions:</p>
				<ul className="list-none list-inside">
					{area.unlockRequirement?.gold && (
						<li className="text-sm text-nowrap">
							{`Or: ${area.unlockRequirement.gold}`}
						</li>
					)}
					{area.unlockRequirement?.level && (
						<li className="text-sm text-nowrap">
							{`Niveau: ${area.unlockRequirement.level}`}
						</li>
					)}
				</ul>
			</div>
		);
	} else {
		return (
			<div className={`${className}`}>
				<p className="text-sm">{area.description}</p>
				<p className="text-sm">Monstres:</p>
				<ul className="list-none list-inside">
					{monsters.map((monster, index) => (
						<li key={index} className="text-sm text-nowrap">
							{monster.name}
						</li>
					))}
				</ul>
			</div>
		);
	}
}
