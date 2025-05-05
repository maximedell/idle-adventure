import {
	useAdventurerActiveSkills,
	useAdventurerExperience,
	useAdventurerCurrentHealth,
	useAdventurerCurrentMana,
	useAdventurerLevel,
} from "../../selectors/AdventurerSelector";
import StatBar from "../shared/StatBar";
import SkillIcon from "../skill/SkillIcon";
import InfoIcon from "../../icons/shared/info.svg?react";
import TooltipWrapper from "../shared/TooltipWrapper";
import SkillTooltip from "../skill/SkillTooltip";
import { useAdventurer } from "../../selectors/GameSelector";

export function AdventurerBox() {
	const adventurer = useAdventurer();
	const level = useAdventurerLevel();
	const activeSkillIds = useAdventurerActiveSkills();
	const experience = useAdventurerExperience();
	const currentHealth = useAdventurerCurrentHealth();
	const currentMana = useAdventurerCurrentMana();
	if (!adventurer) return null;
	const Info = InfoIcon;
	const skills = adventurer
		.getActiveSkills()
		.filter((skill) => activeSkillIds.includes(skill.id));
	return (
		<div className="box-content">
			<div>
				<div className="flex flex-rox justify-center relative">
					<h2 className="title">Aventurier Niv.{level}</h2>
					<button className="w-6 h-6 absolute top-0 right-0 ">
						<Info className="w-full h-full fill-current text-primary-light" />
					</button>
				</div>
				<div className={`flex flex-row gap-2`}>
					{skills.map((skill) => (
						<div key={skill.id} className="flex flex-col items-center">
							<TooltipWrapper
								tooltipContent={
									<SkillTooltip skill={skill} owner={adventurer} />
								}
							>
								<SkillIcon skill={skill} className="w-8 h-8" />
							</TooltipWrapper>
						</div>
					))}
				</div>
			</div>
			<StatBar
				stat={experience}
				maxStat={adventurer.xpRequiredToLevelUp(level)}
				color="exp"
			/>
			<StatBar
				stat={currentHealth}
				maxStat={adventurer.getCombatStat("maxHealth")}
				color="hp"
			/>
			<StatBar
				stat={currentMana}
				maxStat={adventurer.getCombatStat("maxMana")}
				color="mana"
			/>
		</div>
	);
}
