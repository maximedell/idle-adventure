import { useGameStore } from "../stores/GameStore";

export const useActiveArea = () => {
	const activeArea = useGameStore((state) => state.activeArea);
	if (!activeArea) return null;

	return activeArea;
};

export const useIsInCombat = () => {
	return useGameStore((state) => state.inCombat);
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
