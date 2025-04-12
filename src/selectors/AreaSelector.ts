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

export const useBattleState = () => {
	return useGameStore((state) => state.battleState);
};
