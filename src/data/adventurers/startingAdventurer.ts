import { adventurer } from "../../types/adventurer";
import { allSkills } from "../skills";

export const startingAdventurer: adventurer = {
	gold: 0,
	talentPoints: 0,
	destinyPoints: 0,
	unlockedTalentIds: [],
	activeSkills: [allSkills["minor-strike"]],
	stats: {
		strength: 2,
		dexterity: 1,
		intelligence: 0,
		health: 100,
		maxHealth: 100,
		mana: 5,
		maxMana: 5,
		manaRegen: 1,
		level: 1,
		experience: 0,
		experienceToLevelUp: 100,
	},
};
