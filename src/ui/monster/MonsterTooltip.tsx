import React, { JSX } from "react";
import { Monster } from "../../modules/Monster";
import { StatUtil } from "../../utils/StatUtil";

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
	const optionalStats = getOptionnalStats(monster);
	return (
		<div className={`${className} text-nowrap`}>
			<h3 className="text-lg font-bold">{data.name}</h3>
			<p className="text-sm">Niveau: {stats.level}</p>
			<p className="text-sm">PV: {stats.health}</p>
			{optionalStats &&
				optionalStats.map((stat, index) => (
					<React.Fragment key={index}>{stat}</React.Fragment>
				))}
		</div>
	);
}

function getOptionnalStats(monster: Monster): JSX.Element[] | null {
	const stats = monster.getStats();
	const statsList = [];
	for (const [key, value] of Object.entries(stats)) {
		if (key !== "health" && key !== "level" && value > 0) {
			statsList.push(
				<p key={key} className="text-sm">
					{StatUtil.getStatName(key)}: {value}
				</p>
			);
		}
	}
	return statsList.length > 0 ? statsList : null;
}
