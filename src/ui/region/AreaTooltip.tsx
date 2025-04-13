import { DataUtil } from "../../utils/DataUtil";

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
	const area = DataUtil.getAreaData(areaId);
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
					{area.monsters.map((monster, index) => (
						<li key={index} className="text-sm text-nowrap">
							{monster.name}
						</li>
					))}
				</ul>
			</div>
		);
	}
}
