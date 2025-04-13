import { monster } from "../../types/monster";
import { allSkills } from "../skills";
import { allResources } from "../resources";

const resourceDrop = {
	resource: allResources["rat-tail"],
	dropRate: 50,
};
export const rat: monster = {
	id: "rat",
	name: "Rat de campagne",
	stats: {
		strength: 1,
		dexterity: 0,
		intelligence: 0,
		health: 15,
		mana: 0,
		manaRegen: 0,
		level: 1,
		armor: 0,
		magicResist: 0,
	},
	activeSkills: [allSkills["rat-bite"]],
	reviveTime: 30,
	rewards: {
		experience: 5,
		gold: 0,
		resources: [resourceDrop],
	},
	isBoss: false,
};
