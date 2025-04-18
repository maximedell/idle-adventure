import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../stores/GameStore";
import { startCombat } from "../systems/CombatSystem";
import startingAdventurer from "../data/adventurers/startingAdventurer.json";
import villageAlleys from "../data/areas/village-alleys.json";
import { Adventurer } from "../modules/Adventurer";
import { Area } from "../modules/Area";
import { DataUtil } from "../utils/DataUtil";
import { loadGame } from "../systems/SaveSystem";
import { useAreaStore } from "../stores/AreaStore";
import { useInventoryStore } from "../stores/InventoryStore";
import { IconUtil } from "../utils/IconUtil";

export function GameLoop() {
	const hasStartedRef = useRef(false);

	useEffect(() => {
		if (hasStartedRef.current) return;
		hasStartedRef.current = true;
		initGame();
	}, []);
	console.log("GameLoop started");
	const lastUpdate = useRef(performance.now());

	useEffect(() => {
		let frameId: number;
		const loop = (now: number) => {
			const delta = now - lastUpdate.current;
			lastUpdate.current = now;
			applyTick(delta / 1000);
			frameId = requestAnimationFrame(loop);
		};
		frameId = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(frameId);
		};
	}, []);
	return null;
}

function applyTick(delta: number) {
	const state = useGameStore.getState();
	const player = state.adventurer;
	const activeArea = state.activeArea;
	if (!player || !activeArea) return;
	const ennemies = activeArea.getMonsters();
	player.applyTick(delta);
	for (const enemy of ennemies) {
		enemy.applyTick(delta);
	}
	if (state.battleState) {
		startCombat();
	}
}

async function initGame() {
	await DataUtil.preloadAll();

	const save = loadGame();
	if (save) {
		const { game, adventurer, areas, inventory } = save;
		const loadedAdventurer = await Adventurer.create(adventurer);
		let loadedArea: Area;
		if (game.activeArea) {
			useAreaStore.getState().initStore(areas);
			const AreaData = await DataUtil.getAreaById(game.activeArea);
			loadedArea = await Area.create(AreaData);
		} else {
			loadedArea = await Area.create(villageAlleys);
		}
		useGameStore
			.getState()
			.initStore(loadedAdventurer, loadedArea, game.unlockedRegions);
		useInventoryStore.getState().initStore(inventory);
		console.log("Game loaded from save");
	} else {
		const unlockedRegions = { "home-village": ["village-alleys"] };
		const adventurer = await Adventurer.create(startingAdventurer);
		const activeArea = await Area.create(villageAlleys);

		useGameStore.getState().initStore(adventurer, activeArea, unlockedRegions);
		console.log("Game initialized");
	}
}
