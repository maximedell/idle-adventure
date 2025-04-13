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
			<p className="text-sm">Niveau: {data.level}</p>
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
	if (stats.strength > 0) {
		statsList.push(<p className="text-sm">Force: {stats.strength}</p>);
	}
	if (stats.dexterity > 0) {
		statsList.push(<p className="text-sm">Dextérité: {stats.dexterity}</p>);
	}
	if (stats.intelligence > 0) {
		statsList.push(
			<p className="text-sm">Intelligence: {stats.intelligence}</p>
		);
	}
	return statsList.length > 0 ? statsList : null;
}
