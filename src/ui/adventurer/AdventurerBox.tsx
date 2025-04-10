import { useAdventurerStore } from "../../modules/adventurer/AdventurerStore";
import StatBar from "../shared/StatBar";

export function AdventurerBox() {
	const stats = useAdventurerStore((state) => state.stats);
	const adventurerClass =
		useAdventurerStore((state) => state.class) || "Aventurier";
	return (
		<div className="box-adventurer">
			<div>
				<h2 className="title">
					{adventurerClass} Niv.{stats.level}
				</h2>
				<p>Force: {stats.strength}</p>
				<p>Dextérité: {stats.dexterity}</p>
				<p>Intelligence: {stats.intelligence}</p>
			</div>
			<StatBar
				stat={stats.experience}
				maxStat={stats.experienceToLevelUp}
				color="exp"
			/>
			<StatBar stat={stats.health} maxStat={stats.maxHealth} color="hp" />
			<StatBar stat={stats.mana} maxStat={stats.maxMana} color="mana" />
		</div>
	);
}
