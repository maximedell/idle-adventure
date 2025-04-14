import { CombatStats, BaseStatKeys } from "./stats";

export type Class = {
	id: string;
	name: string;
	description: string;
	talents: Talent[];
};

export type Talent = {
	id: string;
	name: string;
	description: string;
	requiredTalentIds: string[];
	talentEffects: TalentEffect[];
	cost: number;
	x?: number;
	y?: number;
};

export type TalentEffect = {
	id: string;
	type: "stat" | "skill" | "onLevelUp" | "combatStatPerBaseStat";
	value?: number;
	damageType?: "physical" | "magical";
	skillId?: string;
	stat?: keyof CombatStats;
	baseStat?: BaseStatKeys;
};
