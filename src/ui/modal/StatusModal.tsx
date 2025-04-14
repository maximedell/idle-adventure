import {
	useAdventurerLevel,
	useAdventurerStats,
	useAdventurerStatPoints,
	useAdventurerClassIds,
	useAdventurerTalentPoints,
} from "../../selectors/AdventurerSelector";
import "./StatusModal.css";
import { useAdventurer } from "../../selectors/GameSelector";
export default function StatusModal() {
	const stats = useAdventurerStats();
	const level = useAdventurerLevel();
	const statPoints = useAdventurerStatPoints();
	const adventurer = useAdventurer();
	const talentPoints = useAdventurerTalentPoints();
	const classIds = useAdventurerClassIds();
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
		<div className="modal">
			<div className="flex flex-col w-fit border border-primary-dark p-2 rounded-lg">
				<h2 className="title">Statistiques</h2>
				<div className="flex flex-col gap-2">
					{Object.entries(stats).map(([key, value]) => (
						<div key={key} className="stat">
							<span className="font-bold">{key}</span>
							<span>{value}</span>
							{statPoints > 0 ? (
								<button
									onClick={() =>
										addStat(key as "strength" | "intelligence" | "dexterity", 1)
									}
									className="stat-button"
								>
									<span className="text-sm font-bold">+</span>
								</button>
							) : (
								<button>
									<span className="invisible">+</span>
								</button>
							)}
						</div>
					))}
				</div>
				<p>Points à dépenser: {statPoints}</p>
			</div>
			<div className="flex flex-col w-fit border border-primary-dark p-2 rounded-lg">
				<h2 className="title">Classe</h2>
				<div className="class">
					{!classIds.length && (
						<>
							<p className="text-sm">Aucune classe sélectionnée</p>
							<button className="class-button">
								<span className="text-sm font-bold">Choisir une classe</span>
							</button>
							<p>Points de talents: {talentPoints}</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
