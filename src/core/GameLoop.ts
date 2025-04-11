import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/GameStore";
import { startCombat } from "../systems/CombatSystem";
import { startingAdventurer } from "../data/adventurers/startingAdventurer";
import { outskirt } from "../data/areas/outskirt";
import { Adventurer } from "../modules/Adventurer";
import { Area } from "../modules/Area";

let gameloop = false;
export function GameLoop() {
	console.log("GameLoop started");
	if (gameloop) {
		console.warn("GameLoop already started");
		return null;
	}
	const adventurer = new Adventurer(startingAdventurer);
	const activeArea = new Area(outskirt);
	useGameStore.getState().initStore(adventurer, activeArea);
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
	if (state.battleState === "fighting") {
		startCombat();
	}
}
