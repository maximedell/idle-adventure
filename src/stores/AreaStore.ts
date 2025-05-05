import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AreaState {
	activeAreaId: string | null;
	monstersByArea: Record<string, string[]>;
	discoveredMonsters: string[];
	monsterMaxPerArea: Record<string, number>;
}

interface AreaActions {
	setActiveAreaId(areaId: string | null): void;
	addArea(areaId: string, monsterUid: string): void;
	addMonsterToArea(areaId: string, monsterUid: string): void;
	setMonstersByArea(monstersByArea: Record<string, string[]>): void;
	addDiscoveredMonster(monsterUid: string): void;
	initStore(areas: {
		activeAreaId: string | null;
		monstersByArea: Record<string, string[]>;
		discoveredMonsters: string[];
		monsterMaxPerArea: Record<string, number>;
	}): void;
	clearStore(): void;
	setMonsterMaxPerArea(areaId: string, max: number): void;
	increaseMonsterMaxPerArea(areaId: string, amount: number): void;
}
interface AreaStore extends AreaState, AreaActions {}

export const useAreaStore = create<AreaStore>()(
	subscribeWithSelector((set) => {
		return {
			activeAreaId: null,
			monstersByArea: {},
			discoveredMonsters: [],
			monsterMaxPerArea: {},
			setActiveAreaId: (areaId: string | null) => {
				set(() => ({
					activeAreaId: areaId,
				}));
			},
			addArea: (areaId: string, monsterUid: string) => {
				set((state) => {
					return {
						monstersByArea: {
							...state.monstersByArea,
							[areaId]: [monsterUid],
						},
					};
				});
			},
			addMonsterToArea: (areaId: string, monsterUid: string) => {
				set((state) => {
					const monsters = state.monstersByArea[areaId] || [];
					return {
						monstersByArea: {
							...state.monstersByArea,
							[areaId]: [...monsters, monsterUid],
						},
					};
				});
			},
			setMonstersByArea: (monstersByArea: Record<string, string[]>) => {
				set(() => ({
					monstersByArea: monstersByArea,
				}));
			},
			addDiscoveredMonster: (monsterUid: string) => {
				set((state) => ({
					discoveredMonsters: [...state.discoveredMonsters, monsterUid],
				}));
			},
			initStore: (areas: {
				activeAreaId: string | null;
				monstersByArea: Record<string, string[]>;
				discoveredMonsters: string[];
				monsterMaxPerArea: Record<string, number>;
			}) => {
				set(() => ({
					monstersByArea: areas.monstersByArea,
					discoveredMonsters: areas.discoveredMonsters,
					monsterMaxPerArea: areas.monsterMaxPerArea,
					activeAreaId: areas.activeAreaId,
				}));
			},
			clearStore: () => {
				set(() => ({
					activeAreaId: null,
					monstersByArea: {},
					discoveredMonsters: [],
					monsterMaxPerArea: {},
				}));
			},
			setMonsterMaxPerArea: (areaId: string, max: number) => {
				set((state) => ({
					monsterMaxPerArea: {
						...state.monsterMaxPerArea,
						[areaId]: max,
					},
				}));
			},
			increaseMonsterMaxPerArea: (areaId: string, amount: number) => {
				set((state) => ({
					monsterMaxPerArea: {
						...state.monsterMaxPerArea,
						[areaId]: (state.monsterMaxPerArea[areaId] || 1) + amount,
					},
				}));
			},
		};
	})
);
