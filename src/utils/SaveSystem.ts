import { SaveData } from "../types/save";
import { useAdventurerStore } from "../stores/AdventurerStore";
import { useGameStore } from "../stores/GameStore";
import { useAreaStore } from "../stores/AreaStore";
import { useInventoryStore } from "../stores/InventoryStore";

const SAVE_KEY = "idle-adventure-save";

export function saveGame() {
	const adventurer = useAdventurerStore.getState();
	const gameState = useGameStore.getState();
	const area = useAreaStore.getState();
	const inventory = useInventoryStore.getState();
	const data: SaveData = {
		version: 1,
		timestamp: Date.now(),
		game: {
			unlockedRegions: gameState.unlockedRegions,
			activeArea: gameState.activeArea?.getId() || null,
		},
		adventurer: {
			strength: adventurer.strength,
			dexterity: adventurer.dexterity,
			intelligence: adventurer.intelligence,
			level: adventurer.level,
			experience: adventurer.experience,
			currentHealth: adventurer.currentHealth,
			currentMana: adventurer.currentMana,
			statPoints: adventurer.statPoints,
			talentPoints: adventurer.talentPoints,
			classIds: adventurer.classIds,
			activeSkillIds: adventurer.activeSkills,
			unlockedSkillIds: adventurer.unlockedSkills,
			unlockedTalentIds: adventurer.unlockedTalentIds,
		},
		areas: {
			monstersByArea: area.monstersByArea,
		},
		inventory: {
			size: inventory.size,
			items: inventory.items,
			resources: inventory.resources,
			gold: inventory.gold,
		},
	};

	localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadGame(): SaveData | null {
	const saveData = localStorage.getItem(SAVE_KEY);
	if (!saveData) return null;

	try {
		const parsedData: SaveData = JSON.parse(saveData);
		return parsedData;
	} catch (error) {
		console.error("Error loading save data:", error);
		return null;
	}
}
