import { useAreaStore } from "../stores/AreaStore";
import { useGameStore } from "../stores/GameStore";

export const useAreaMonsters = () => {
	const monstersByArea = useAreaStore((state) => state.monstersByArea);
	const activeArea = useGameStore((state) => state.activeArea);
	if (!activeArea) return null;

	const monsters = monstersByArea[activeArea.getId()] || [];
	return monsters;
};

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

export const useBattleState = () => {
	const battleState = useGameStore((state) => state.battleState);
	return battleState;
};
