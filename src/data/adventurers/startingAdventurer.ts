import { adventurer } from "../../types/adventurer";
import { allSkills } from "../skills";

export const startingAdventurer: adventurer = {
	gold: 0,
	talentPoints: 0,
	destinyPoints: 0,
	unlockedTalentIds: [],
	activeSkills: [allSkills["minor-strike"], allSkills["striking-arrows"]],
	stats: {
		strength: 2,
		dexterity: 1,
		intelligence: 0,
		health: 100,
		maxHealth: 100,
		mana: 10,
		maxMana: 10,
		manaRegen: 1,
		level: 1,
	},
};
