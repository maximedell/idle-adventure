export type SaveData = {
	version: number;
	timestamp: number;
	game: {
		unlockedRegions: Record<string, string[]>;
		activeArea: string | null;
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
		monstersByArea: Record<string, string[]>;
		discoveredMonsters: string[];
	};
	inventory: {
		size: number;
		items: Record<string, number>;
		resources: Record<string, number>;
		gold: number;
		discoveredResources: string[];
	};
};
