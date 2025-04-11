import { useGameStore } from "../stores/GameStore";

export const useActiveArea = () => {
	const activeArea = useGameStore((state) => state.activeArea);
	if (!activeArea) return null;

	return activeArea;
};

export const useIsFighting = () => {
	const battleState = useGameStore((state) => state.battleState);
	return battleState === "fighting";
};

export const useIsIdle = () => {
	const battleState = useGameStore((state) => state.battleState);
	return battleState === "idle";
};

export const useAdventurer = () => {
	const adventurer = useGameStore((state) => state.adventurer);
	if (!adventurer) return null;

	return adventurer;
};

export const useBattleLog = () => {
	const battleLog = useGameStore((state) => state.battleLog);
	if (!battleLog) return null;

	return battleLog;
};
