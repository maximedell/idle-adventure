export type adventurerClass = {
	id: string;
	name: string;
	baseSkillId: string;
	talentTree: talentTree;
};

export type talentTree = {
	id: string;
	name: string;
	talents: talent[];
};

export type talent = {
	id: string;
	name: string;
	description: string;
	requiredTalentIds: string[];
	effects: talentEffect[];
	cost: number;
	x?: number;
	y?: number;
};

export type talentEffect =
	| statEffect
	| unlockSkillEffect
	| globalDamageEffect
	| globalDefenseEffect;

export type statEffect = {
	type: "stat";
	stat:
		| "strength"
		| "dexterity"
		| "intelligence"
		| "mana"
		| "health"
		| "manaRegen";
	value: number;
};

export type unlockSkillEffect = {
	type: "skill";
	skillId: string;
};

export type globalDamageEffect = {
	type: "globalDamage";
	damageType: "physical" | "magical";
	value: number; // % bonus
};

export type globalDefenseEffect = {
	type: "globalDefense";
	damageType: "physical" | "magical";
	value: number; // % réduction
};
