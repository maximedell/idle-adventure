import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface UIState {
	currentMenu: string;
}

interface UIActions {
	setCurrentMenu: (menu: string) => void;
}

interface UIStore extends UIState, UIActions {}

export const useUIStore = create<UIStore>()(
	subscribeWithSelector((set) => ({
		currentMenu: "combat",
		setCurrentMenu: (menu: string) => {
			set(() => ({
				currentMenu: menu,
			}));
		},
	}))
);
