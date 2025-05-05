export type SaveData = {
	version: number;
	timestamp: number;
	game: {
		unlockedRegions: Record<string, string[]>;
		unlockedFeaturesFromShop: string[];
		purchasedShopItems: string[];
	};
	adventurer: {
		strength: number;
		dexterity: number;
		intelligence: number;
		level: number;
		experience: number;
		currentHealth: number;
		currentMana: number;
		statPoints: number;
		talentPoints: number;
		classIds: string[];
		activeSkillIds: string[];
		unlockedSkillIds: string[];
		unlockedTalentIds: string[];
	};
	areas: {
		activeAreaId: string | null;
		monstersByArea: Record<string, string[]>;
		discoveredMonsters: string[];
		monsterMaxPerArea: Record<string, number>;
	};
	inventory: {
		size: number;
		items: Record<string, number>;
		resources: Record<string, number>;
		gold: number;
		discoveredResources: string[];
		maxGold: number;
	};
};
