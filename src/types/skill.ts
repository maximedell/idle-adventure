import { CombatStats } from "./stats";

export type Skill = {
	id: string;
	name: string;
	description: string;
	manaCost: number;
	cooldown: number; // in seconds
	effects: SkillEffect[];
};

export type SkillEffect = {
	type: "buffStat" | "damage" | "buffDamage" | "buffDefense";
	stat?: keyof CombatStats;
	damageType?: "physical" | "magical";
	value: number;
	target?: number; // number of targets (AoE)
	duration?: number; // in seconds
};
