import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface UIState {
	isStatusOpen: boolean;
	isInventoryOpen: boolean;
	isSettingsOpen: boolean;
	isShopOpen: boolean;
}

interface UIActions {
	toggleStatus: () => void;
	toggleInventory: () => void;
	toggleSettings: () => void;
	toggleShop: () => void;
}

interface UIStore extends UIState, UIActions {}

export const useUIStore = create<UIStore>()(
	subscribeWithSelector((set) => ({
		isStatusOpen: false,
		isInventoryOpen: false,
		isSettingsOpen: false,
		isShopOpen: false,
		toggleStatus: () => set((state) => ({ isStatusOpen: !state.isStatusOpen })),
		toggleInventory: () =>
			set((state) => ({ isInventoryOpen: !state.isInventoryOpen })),
		toggleSettings: () =>
			set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
		toggleShop: () => set((state) => ({ isShopOpen: !state.isShopOpen })),
	}))
);
