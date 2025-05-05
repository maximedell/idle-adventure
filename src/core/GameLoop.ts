import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../stores/GameStore";
import { startCombat } from "../systems/CombatSystem";
import { DataUtil } from "../utils/DataUtil";
import { loadGame, startGame, loadSave } from "../systems/SaveSystem";

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
	const activeArea = state.area;
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

	const save = loadSave();
	if (save) {
		loadGame(save);
		console.log("Game loaded from save");
	} else {
		startGame();
		console.log("Game initialized");
	}
}
