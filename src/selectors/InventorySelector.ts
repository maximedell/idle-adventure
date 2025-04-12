import { useInventoryStore } from "../stores/InventoryStore";

export const useResources = () => {
	return useInventoryStore((state) => state.resources);
};

export const useGold = () => {
	return useInventoryStore((state) => state.gold);
};

export const useInventorySizeMax = () => {
	return useInventoryStore((state) => state.size);
};

export const useInventorySizeTaken = () => {
	return Object.values(useInventoryStore.getState().resources).reduce(
		(acc, resource) => {
			return acc + resource;
		},
		0
	);
};
