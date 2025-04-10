export type skill = {
	id: string;
	name: string;
	description: string;
	manaCost: number;
	cooldown: number; // in seconds
	effects: skillEffect[];
};

export type skillEffect =
	| buffStatEffect
	| damageEffect
	| buffDamageEffect
	| buffDefenseEffect;

export type buffStatEffect = {
	type: "buffStat";
	stat:
		| "strength"
		| "dexterity"
		| "intelligence"
		| "health"
		| "mana"
		| "manaRegen";
	value: number;
	duration: number; // in seconds
};

export type damageEffect = {
	type: "damage";
	damageType: "physical" | "magical";
	value: number;
	duration?: number; // in seconds
};

export type buffDamageEffect = {
	type: "buffDamage";
	damageType: "physical" | "magical";
	value: number;
	duration?: number; // in seconds
};

export type buffDefenseEffect = {
	type: "buffDefense";
	damageType: "physical" | "magical";
	value: number;
	duration?: number; // in seconds
};
