import { useAreaStore } from "../stores/AreaStore";
import { useGameStore } from "../stores/GameStore";
export const useActiveAreaId = () => {
	return useAreaStore((state) => state.activeAreaId);
};
export const useMonstersByArea = () => {
	return useAreaStore((state) => state.monstersByArea);
};

export const useBattleState = () => {
	return useGameStore((state) => state.battleState);
};

export const useMaxMontersPerArea = () => {
	return useAreaStore((state) => state.monsterMaxPerArea);
};
