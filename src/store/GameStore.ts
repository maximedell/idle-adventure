import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Adventurer } from "../modules/adventurer/Adventurer";
import { startingAdventurer } from "../data/adventurers/startingAdventurer";
import { Area } from "../modules/area/Area";
import { outskirt } from "../data/areas/outskirt";

interface GameState {
	adventurer: Adventurer | null;
	activeArea: Area | null;
	unlockedAreas: string[];
}

interface GameActions {
	initStore: (adventurer: Adventurer, area: Area) => void;
}

interface GameStore extends GameState, GameActions {}

export const useGameStore = create<GameStore>()(
	subscribeWithSelector((set) => {
		return {
			adventurer: null,
			activeArea: null,
			unlockedAreas: [],

			initStore: (adventurer: Adventurer, area: Area) =>
				set(() => ({
					adventurer: adventurer,
					activeArea: area,
					unlockedAreas: ["outskirt"],
				})),
		};
	})
);
