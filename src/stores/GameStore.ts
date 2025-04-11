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
	activeArea: Area | null;
	unlockedAreas: string[];
	battleState: "idle" | "fighting";
	battleLog: LogEntry[];
}

interface GameActions {
	initStore: (adventurer: Adventurer, area: Area) => void;
	setBattleState(state: "idle" | "fighting"): void;
	addBattleLog(message: string, type: LogType): void; // Add a log to the battle log, if the log is full, remove the first one
	clearBattleLog(): void;
}

interface GameStore extends GameState, GameActions {}

const MAX_LOG_LENGTH = 100;

export const useGameStore = create<GameStore>()(
	subscribeWithSelector((set) => {
		return {
			adventurer: null,
			activeArea: null,
			unlockedAreas: [],
			battleState: "idle",
			battleLog: [],

			initStore: (adventurer: Adventurer, area: Area) =>
				set(() => ({
					adventurer: adventurer,
					activeArea: area,
					unlockedAreas: ["outskirt"],
				})),
			setBattleState: (state: "idle" | "fighting") => {
				set({ battleState: state });
			},
			addBattleLog: (message: string, type: LogType) => {
				set((state) => ({
					battleLog: [...state.battleLog, { message, type }].slice(
						-MAX_LOG_LENGTH
					),
				}));
			},
			clearBattleLog: () => {
				set({ battleLog: [] });
			},
		};
	})
);
