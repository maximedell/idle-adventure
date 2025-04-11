import { skill } from "../../types/skill";
export const ratBite: skill = {
	id: "rat-bite",
	name: "Morsure de rat",
	description: "Inflige 1 dégât physique.",
	manaCost: 0,
	cooldown: 1,
	effects: [
		{
			type: "damage",
			damageType: "physical",
			value: 1,
			target: 1,
		},
	],
};
