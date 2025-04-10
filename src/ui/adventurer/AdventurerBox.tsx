import {
	useAdventurerStats,
	useAdventurerClass,
	useAdventurerActiveSkills,
	useAdventurerExperience,
} from "../../selectors/AdventurerSelector";
import { useAdventurer } from "../../selectors/GameSelector";
import StatBar from "../shared/StatBar";
import SkillIcon from "../skill/SkillIcon";
import InfoIcon from "../../icons/shared/info.svg?react";

export function AdventurerBox() {
	const adventurer = useAdventurer();
	if (!adventurer) return null;
	const stats = useAdventurerStats();
	const adventurerClass = useAdventurerClass();
	const activeSkillIds = useAdventurerActiveSkills();
	const experience = useAdventurerExperience();
	const Info = InfoIcon;
	const skills = adventurer
		.getActiveSkills()
		.filter((skill) => activeSkillIds.includes(skill.id));
	return (
		<div className="box-adventurer">
			<div>
				<div className="flex flex-rox justify-center relative">
					<h2 className="title">
						{adventurerClass} Niv.{stats.level}
					</h2>
					<button className="w-6 h-6 absolute top-0 right-0 ">
						<Info className="w-full h-full fill-current text-primary-light" />
					</button>
				</div>
				<div className={`flex flex-row gap-2`}>
					{skills.map((skill) => (
						<div key={skill.id} className="flex flex-col items-center">
							<SkillIcon skill={skill} className="w-8 h-8" />
						</div>
					))}
				</div>
			</div>
			<StatBar
				stat={experience}
				maxStat={adventurer.xpRequiredToLevelUp(stats.level)}
				color="exp"
			/>
			<StatBar stat={stats.health} maxStat={stats.maxHealth} color="hp" />
			<StatBar stat={stats.mana} maxStat={stats.maxMana} color="mana" />
		</div>
	);
}
