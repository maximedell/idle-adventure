import { adventurer } from "../../types/adventurer";
import { allSkills } from "../skills";

export const startingAdventurer: adventurer = {
	gold: 0,
	talentPoints: 0,
	destinyPoints: 0,
	unlockedTalentIds: [],
	activeSkills: [allSkills["minor-strike"], allSkills["striking-arrows"]],
	stats: {
		strength: 0,
		dexterity: 0,
		intelligence: 0,
		level: 1,
	},
};
