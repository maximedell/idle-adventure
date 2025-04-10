import { monster } from "../../types/monster";
import { allSkills } from "../skills";

export const slime: monster = {
	id: "slime",
	name: "Gelée verte",
	stats: {
		strength: 1,
		dexterity: 0,
		intelligence: 0,
		health: 50,
		maxHealth: 50,
		mana: 0,
		maxMana: 0,
		manaRegen: 0,
		level: 1,
		experience: 10,
		experienceToLevelUp: 0,
	},
	activeSkills: [allSkills["minor-strike"]],
	rewards: {
		experience: 10,
		gold: 3,
		resources: [],
	},
	isBoss: false,
};
