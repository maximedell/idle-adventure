import { CombatStats, BaseStatDependentStatKeys } from "../types/stats";

export const BASE_STAT_DEPENDENT_CONSTANTS = {
	armor: 0.1,
	magicResist: 0.1,
	criticalChance: 0.01,
	criticalDamageMultiplier: 0.05,
	maxMana: 2,
	manaRegen: 0.1,
};

export const PER_LEVEL_CONSTANTS = {
	baseStat: 1,
	health: 50,
	statPoints: 3,
	talentPoints: 1,
};

export const XP_CONSTANTS = {
	baseXP: 100,
	levelExponent: 1.2,
};

export const BASE_STATS_CONSTANTS = {
	strength: 0,
	dexterity: 0,
	intelligence: 0,
	maxHealth: 100,
	maxMana: 5,
	manaRegen: 0.2,
};
