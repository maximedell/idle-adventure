import { skill } from "../../types/skill";

export const strikingArrows: skill = {
	id: "striking-arrows",
	name: "Flèches multpiles",
	description: "Inflige 5 dégâts physiques à 3 cibles.",
	manaCost: 3,
	cooldown: 5,
	effects: [
		{
			type: "damage",
			value: 5,
			damageType: "physical",
			target: 3,
		},
	],
};
