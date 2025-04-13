export type CombatStats = {
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
