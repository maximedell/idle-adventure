import { SaveData } from "../types/save";
import { useAdventurerStore } from "../stores/AdventurerStore";
import { useGameStore } from "../stores/GameStore";
import { useAreaStore } from "../stores/AreaStore";
import { useInventoryStore } from "../stores/InventoryStore";
import startingAdventurer from "../data/adventurers/startingAdventurer.json";
import villageAlleys from "../data/areas/village-alleys.json";
import { Adventurer } from "../modules/Adventurer";
import { Area } from "../modules/Area";
import { useMonsterStore } from "../stores/MonsterStore";
import { DataUtil } from "../utils/DataUtil";

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
			unlockedFeaturesFromShop: gameState.unlockedFeaturesFromShop,
			purchasedShopItems: gameState.purchasedShopItems,
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
			activeAreaId: area.activeAreaId,
			monstersByArea: area.monstersByArea,
			discoveredMonsters: area.discoveredMonsters,
			monsterMaxPerArea: area.monsterMaxPerArea,
		},
		inventory: {
			size: inventory.size,
			items: inventory.items,
			resources: inventory.resources,
			gold: inventory.gold,
			discoveredResources: inventory.discoveredResources,
			maxGold: inventory.maxGold,
		},
	};

	localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadSave(): SaveData | null {
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

export async function loadGame(save: SaveData) {
	const { game, adventurer, areas, inventory } = save;
	await Adventurer.create(adventurer);
	if (areas.activeAreaId) {
		const AreaData = await DataUtil.getAreaById(areas.activeAreaId);
		await Area.create(AreaData);
		useAreaStore.getState().initStore(areas);
	} else {
		await Area.create(villageAlleys);
	}
	useGameStore.getState().initStore(game);
	useInventoryStore.getState().initStore(inventory);
	saveGame();
}

export async function startGame() {
	localStorage.removeItem(SAVE_KEY);
	useGameStore.getState().clearStore();
	useInventoryStore.getState().clearStore();
	useAreaStore.getState().clearStore();
	useMonsterStore.getState().clearStore();
	useAdventurerStore.getState().clearStore();
	await Adventurer.create(startingAdventurer);
	await Area.create(villageAlleys);

	const unlockedRegions = { "home-village": ["village-alleys"] };
	const unlockedFeaturesFromShop = [] as string[];
	const purchasedShopItems = [] as string[];
	const game = {
		unlockedRegions,
		unlockedFeaturesFromShop,
		purchasedShopItems,
	};

	useGameStore.getState().initStore(game);
	useAreaStore.getState().setActiveAreaId("village-alleys");
}

export async function initGame() {
	await DataUtil.preloadAll();

	const save = loadSave();
	if (save) {
		loadGame(save);
		console.log("Game loaded from save");
	} else {
		startGame();
		console.log("Game initialized");
	}
}
