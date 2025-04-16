import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Adventurer } from "../modules/Adventurer";
import { Area } from "../modules/Area";

type LogType = "info" | "warning" | "danger" | "success" | "default";

type LogEntry = {
	message: string;
	type: LogType;
};
interface GameState {
	adventurer: Adventurer | null;

	unlockedRegions: Record<string, string[]>;
	activeArea: Area | null;
	battleState: boolean;
	battleLog: LogEntry[];
	inCombat: boolean;
	unlockedFeaturesFromShop: string[];
	purchasedShopItems: string[];
}

interface GameActions {
	initStore: (
		adventurer: Adventurer,
		area: Area,
		unlockedRegions: Record<string, string[]>
	) => void;
	setBattleState(state: boolean): void;
	addBattleLog(message: string, type: LogType): void; // Add a log to the battle log, if the log is full, remove the first one
	clearBattleLog(): void;
	setInCombat(val: boolean): void;
}

interface GameStore extends GameState, GameActions {}

const MAX_LOG_LENGTH = 100;

export const useGameStore = create<GameStore>()(
	subscribeWithSelector((set) => {
		return {
			adventurer: null,
			unlockedRegions: {},
			activeArea: null,
			battleState: false,
			battleLog: [],
			inCombat: false,
			unlockedFeaturesFromShop: [],
			purchasedShopItems: [],

			initStore: (adventurer, area, unlockedRegions) =>
				set(() => ({
					adventurer: adventurer,
					activeArea: area,
					unlockedRegions: unlockedRegions,
					unlockedAreas: ["outskirt"],
				})),
			setBattleState: (state) => {
				set({ battleState: state });
			},
			addBattleLog: (message, type) => {
				set((state) => ({
					battleLog: [...state.battleLog, { message, type }].slice(
						-MAX_LOG_LENGTH
					),
				}));
			},
			clearBattleLog: () => {
				set({ battleLog: [] });
			},
			setInCombat: (val) => {
				set({ inCombat: val });
			},
		};
	})
);
