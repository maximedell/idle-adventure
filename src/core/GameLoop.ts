import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/GameStore";
import { startCombat } from "../systems/CombatSystem";
import { startingAdventurer } from "../data/adventurers/startingAdventurer";
import { villageAlleys } from "../data/areas/village-alleys";
import { Adventurer } from "../modules/Adventurer";
import { Area } from "../modules/Area";

let gameloop = false;
export function GameLoop() {
	console.log("GameLoop started");
	if (gameloop) {
		console.warn("GameLoop already started");
		return null;
	}
	initGame();

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

function initGame() {
	const state = useGameStore.getState();
	const unlockedRegions = { "home-village": ["village-alleys"] };
	const adventurer = new Adventurer(startingAdventurer);
	const activeArea = new Area(villageAlleys);
	state.initStore(adventurer, activeArea, unlockedRegions);
	gameloop = true;
	console.log("Game initialized");
}
