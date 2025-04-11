import { monster } from "../../types/monster";
import { allSkills } from "../skills";

export const rat: monster = {
	id: "rat",
	name: "Rat des villes",
	stats: {
		strength: 1,
		dexterity: 0,
		intelligence: 0,
		health: 15,
		maxHealth: 15,
		mana: 0,
		maxMana: 0,
		manaRegen: 0,
		level: 1,
		experience: 10,
		experienceToLevelUp: 0,
	},
	activeSkills: [allSkills["rat-bite"]],
	reviveTime: 30,
	rewards: {
		experience: 10,
		gold: 3,
		resources: [],
	},
	isBoss: false,
};
