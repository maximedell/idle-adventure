import {
	useAdventurerStats,
	useAdventurerStatPoints,
	useAdventurerClassIds,
	useAdventurerTalentPoints,
	useAdventurerCombatStats,
} from "../../selectors/AdventurerSelector";
import "./Status.css";
import { StatUtil } from "../../utils/StatUtil";
import { useUIStore } from "../../stores/UIStore";
import { CombatStats } from "../../types/stats";
import CombatStatsComponent from "../shared/CombatStatsComponent";
import { useAdventurer } from "../../selectors/GameSelector";
export default function Status() {
	const stats = useAdventurerStats();
	const combatStats = useAdventurerCombatStats();
	const statPoints = useAdventurerStatPoints();
	const adventurer = useAdventurer();
	const talentPoints = useAdventurerTalentPoints();
	const classIds = useAdventurerClassIds();
	const setCurrentMenu = useUIStore.getState().setCurrentMenu;
	if (classIds.length) {
		//TODO fetch class data
	}
	if (!adventurer) return null;
	const addStat = (
		key: "strength" | "intelligence" | "dexterity",
		value: number
	) => {
		if (statPoints > 0) {
			adventurer.increaseStat(key, value);
		}
	};

	return (
		<div className="box-content flex flex-col gap-4 justify-center">
			<div className="box-content flex flex-row gap-4 justify-center">
				<div className="flex flex-col w-fit p-2 gap-2">
					<h2>Points investis</h2>
					<div className="flex flex-col gap-2 border border-primary rounded p-2">
						<h2 className="text-lg">Caractéristiques</h2>
						{Object.entries(stats).map(([key, value]) => (
							<div
								key={key}
								className="grid grid-cols-[1fr_auto_auto] items-center gap-2 py-1"
							>
								<span className="font-bold">
									{StatUtil.getStatName(key as keyof CombatStats)}
								</span>
								<span>{value}</span>
								{statPoints > 0 ? (
									<button
										onClick={() =>
											addStat(
												key as "strength" | "intelligence" | "dexterity",
												1
											)
										}
										className="stat-button"
									>
										<span className="text-sm font-bold">+</span>
									</button>
								) : (
									<button className="invisible">
										<span className="invisible">+</span>
									</button>
								)}
							</div>
						))}
						<p>Points à dépenser: {statPoints}</p>
					</div>

					<div className="flex flex-col gap-2 border border-primary rounded p-2">
						<h2 className="text-lg">Talents</h2>
						<div className="class">
							{!classIds.length && (
								<>
									<p className="text-sm">Aucune classe sélectionnée</p>
									<button
										className="class-button"
										onClick={() => setCurrentMenu("class")}
									>
										<span className="text-sm font-bold">
											Choisir une classe
										</span>
									</button>
									<p>Points de talents: {talentPoints}</p>
								</>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col p-2">
					<h2 className="pb-2">Stats</h2>
					<CombatStatsComponent combatStats={combatStats} />
				</div>
			</div>
			<div className="flex flex-col p-2">
				<h2 className="text-center">Equipement</h2>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
