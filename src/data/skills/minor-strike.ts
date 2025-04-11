import { skill } from "../../types/skill";

export const minorStrike: skill = {
	id: "minor-strike",
	name: "Frappe mineure",
	description: "Inflige 10 dégâts physiques.",
	manaCost: 0,
	cooldown: 2,
	effects: [
		{
			type: "damage",
			value: 10,
			damageType: "physical",
			target: 1,
		},
	],
};
