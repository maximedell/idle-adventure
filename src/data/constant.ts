import { CombatStats, BaseStatDependentStatKeys } from "../types/stats";

export const PER_STAT_DEPENDENT_CONSTANTS = {
	criticalChance: 0.01,
	criticalDamageMultiplier: 0.05,
	maxMana: 2,
	manaRegen: 0.1,
	damageMultiplierPhysical: 0.01,
	damageMultiplierMagical: 0.01,
	defenseMultiplierPhysical: 0.005,
	defenseMultiplierMagical: 0.005,
	cooldownReduction: 0.005,
} as const;

export const PER_LEVEL_CONSTANTS = {
	intelligence: 1,
	strength: 1,
	dexterity: 1,
	maxHealth: 50,
	statPoints: 3,
	talentPoints: 1,
} as const;

export const XP_CONSTANTS = {
	baseXP: 100,
	levelExponent: 1.2,
} as const;

export const BASE_STATS_CONSTANTS = {
	strength: 0,
	dexterity: 0,
	intelligence: 0,
	maxHealth: 100,
	maxMana: 5,
	manaRegen: 0.2,
	criticalChance: 0,
	criticalDamageMultiplier: 1,
	damageMultiplierPhysical: 1,
	damageMultiplierMagical: 1,
	defenseMultiplierPhysical: 1,
	defenseMultiplierMagical: 1,
	cooldownReduction: 1,
} as const;

// 🎯 Constantes avec as const
export const BASE_STAT_KEYS = [
	"strength",
	"dexterity",
	"intelligence",
] as const;
export const LEVEL_DEPENDENT_STAT_KEYS = [
	...BASE_STAT_KEYS,
	"maxHealth",
] as const;

export const DEXTERITY_DEPENDENT_STAT_KEYS = [
	"criticalChance",
	"criticalDamageMultiplier",
	"cooldownReduction",
] as const;

export const INTELLIGENCE_DEPENDENT_STAT_KEYS = [
	"maxMana",
	"manaRegen",
	"defenseMultiplierMagical",
	"damageMultiplierMagical",
] as const;

export const STRENGTH_DEPENDENT_STAT_KEYS = [
	"defenseMultiplierPhysical",
	"damageMultiplierPhysical",
] as const;

export const BASE_STAT_DEPENDENT_STAT_KEYS = [
	...STRENGTH_DEPENDENT_STAT_KEYS,
	...DEXTERITY_DEPENDENT_STAT_KEYS,
	...INTELLIGENCE_DEPENDENT_STAT_KEYS,
] as const;

export const GENERAL_STAT_KEYS = ["armor", "magicResist"] as const;
