import {
	BASE_STAT_KEYS,
	LEVEL_DEPENDENT_STAT_KEYS,
	DEXTERITY_DEPENDENT_STAT_KEYS,
	INTELLIGENCE_DEPENDENT_STAT_KEYS,
	STRENGTH_DEPENDENT_STAT_KEYS,
	BASE_STAT_DEPENDENT_STAT_KEYS,
	GENERAL_STAT_KEYS,
} from "../data/constant";
export type BaseStatKeys = (typeof BASE_STAT_KEYS)[number];
export type LevelDependentStatKeys = (typeof LEVEL_DEPENDENT_STAT_KEYS)[number];

export type DexterityDependentStatKeys =
	(typeof DEXTERITY_DEPENDENT_STAT_KEYS)[number];
export type IntelligenceDependentStatKeys =
	(typeof INTELLIGENCE_DEPENDENT_STAT_KEYS)[number];
export type StrengthDependentStatKeys =
	(typeof STRENGTH_DEPENDENT_STAT_KEYS)[number];

export type BaseStatDependentStatKeys =
	(typeof BASE_STAT_DEPENDENT_STAT_KEYS)[number];

export type GeneralStatKeys = (typeof GENERAL_STAT_KEYS)[number];
export type CombatStats = {
	level: number;

	strength: number;
	dexterity: number;
	intelligence: number;

	maxHealth: number;
	maxMana: number;
	manaRegen: number;

	armor: number;
	magicResist: number;
	criticalChance: number;
	criticalDamageMultiplier: number;

	damageMultiplierPhysical: number;
	damageMultiplierMagical: number;
	defenseMultiplierPhysical: number;
	defenseMultiplierMagical: number;
	cooldownReduction: number;
};
