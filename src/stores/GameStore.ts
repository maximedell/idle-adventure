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
	area: Area | null;
	unlockedRegions: Record<string, string[]>;
	battleState: boolean;
	battleLog: LogEntry[];
	inCombat: boolean;
	unlockedFeaturesFromShop: string[];
	purchasedShopItems: string[];
}

interface GameActions {
	initStore: (game: {
		unlockedRegions: Record<string, string[]>;
		unlockedFeaturesFromShop: string[];
		purchasedShopItems: string[];
	}) => void;
	clearStore: () => void;
	setBattleState(state: boolean): void;
	addBattleLog(message: string, type: LogType): void; // Add a log to the battle log, if the log is full, remove the first one
	clearBattleLog(): void;
	setInCombat(val: boolean): void;
	unlockRegion(regionId: string, areaIds: string[]): void;
	unlockArea(regionId: string, areaId: string): void;
	unlockFeatureFromShop(featureId: string): void;
	addPurchasedShopItem(itemId: string): void;
}

interface GameStore extends GameState, GameActions {}

const MAX_LOG_LENGTH = 100;

export const useGameStore = create<GameStore>()(
	subscribeWithSelector((set) => {
		return {
			adventurer: null,
			area: null,
			unlockedRegions: {},
			battleState: false,
			battleLog: [],
			inCombat: false,
			unlockedFeaturesFromShop: [],
			purchasedShopItems: [],

			initStore: (game) =>
				set(() => ({
					unlockedRegions: game.unlockedRegions,
					unlockedFeaturesFromShop: game.unlockedFeaturesFromShop,
					purchasedShopItems: game.purchasedShopItems,
				})),
			clearStore: () =>
				set(() => ({
					unlockedRegions: {},
					unlockedFeaturesFromShop: [],
					purchasedShopItems: [],
					battleState: false,
					battleLog: [],
					inCombat: false,
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
			unlockRegion: (regionId, areaIds) =>
				set((state) => ({
					unlockedRegions: {
						...state.unlockedRegions,
						[regionId]: areaIds,
					},
				})),
			unlockArea: (regionId, areaId) =>
				set((state) => ({
					unlockedRegions: {
						...state.unlockedRegions,
						[regionId]: [...(state.unlockedRegions[regionId] || []), areaId],
					},
				})),
			unlockFeatureFromShop: (featureId) =>
				set((state) => ({
					unlockedFeaturesFromShop: [
						...state.unlockedFeaturesFromShop,
						featureId,
					],
				})),
			addPurchasedShopItem: (itemId) =>
				set((state) => ({
					purchasedShopItems: [...state.purchasedShopItems, itemId],
				})),
		};
	})
);
