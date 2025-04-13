export type stats = {
	strength: number;
	dexterity: number;
	intelligence: number;
	level: number;
};

export type monsterStats = {
	health: number;
	mana: number;
	manaRegen: number;
	strength: number;
	dexterity: number;
	intelligence: number;
	level: number;
	armor: number;
	magicResist: number;
};

export type combatStats = {
	strength: number;
	dexterity: number;
	intelligence: number;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
	manaRegen: number;

	armor: number;
	magicResist: number;

	damageMultiplierPhysical: number;
	damageMultiplierMagical: number;
	defenseMultiplierPhysical: number;
	defenseMultiplierMagical: number;
	cooldownReduction: number;
	criticalChance: number;
	criticalDamageMultiplier: number;
};
