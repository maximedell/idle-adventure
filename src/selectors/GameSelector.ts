import { useGameStore } from "../stores/GameStore";

export const useActiveArea = () => {
	return useGameStore((state) => state.activeArea);
};

export const useIsInCombat = () => {
	return useGameStore((state) => state.inCombat);
};

export const useAdventurer = () => {
	return useGameStore((state) => state.adventurer);
};

export const useBattleLog = () => {
	return useGameStore((state) => state.battleLog);
};

export const useUnlockedRegionIds = () => {
	return useGameStore((state) => state.unlockedRegions);
};

export const useUnlockedAreas = (regionId: string) => {
	return useGameStore((state) => state.unlockedRegions);
};

export const usePurchasedShopItems = () => {
	return useGameStore((state) => state.purchasedShopItems);
};

export const useUnlockedFeaturesFromShop = () => {
	return useGameStore((state) => state.unlockedFeaturesFromShop);
};
