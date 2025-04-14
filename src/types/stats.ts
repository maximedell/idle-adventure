export type BaseStatKeys = "strength" | "dexterity" | "intelligence";
export type LevelDependentStatKeys =
	| "strength"
	| "dexterity"
	| "intelligence"
	| "maxHealth";

export type BaseStatDependentStatKeys =
	| "maxMana"
	| "manaRegen"
	| "armor"
	| "magicResist"
	| "criticalChance"
	| "criticalDamageMultiplier";

export type GeneralStatKeys =
	| "damageMultiplierPhysical"
	| "damageMultiplierMagical"
	| "defenseMultiplierPhysical"
	| "defenseMultiplierMagical"
	| "cooldownReduction";

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
