import { useUIStore } from "../stores/UIStore";

export const useIsStatusOpen = () => {
	return useUIStore((state) => state.isStatusOpen);
};

export const useIsInventoryOpen = () => {
	return useUIStore((state) => state.isInventoryOpen);
};

export const useIsSettingsOpen = () => {
	return useUIStore((state) => state.isSettingsOpen);
};

export const useIsShopOpen = () => {
	return useUIStore((state) => state.isShopOpen);
};

export const useToggleStatus = () => {
	return useUIStore((state) => state.toggleStatus);
};
