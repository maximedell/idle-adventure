import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AreaState {
	monstersByArea: Record<string, string[]>;
	discoveredMonsters: string[];
}

interface AreaActions {
	addArea(areaId: string, monsterUid: string): void;
	addMonsterToArea(areaId: string, monsterUid: string): void;
	setMonstersByArea(monstersByArea: Record<string, string[]>): void;
	addDiscoveredMonster(monsterUid: string): void;
	initStore(areas: {
		monstersByArea: Record<string, string[]>;
		discoveredMonsters: string[];
	}): void;
}
interface AreaStore extends AreaState, AreaActions {}

export const useAreaStore = create<AreaStore>()(
	subscribeWithSelector((set) => {
		return {
			monstersByArea: {},
			discoveredMonsters: [],
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
				monstersByArea: Record<string, string[]>;
				discoveredMonsters: string[];
			}) => {
				set(() => ({
					monstersByArea: areas.monstersByArea,
					discoveredMonsters: areas.discoveredMonsters,
				}));
			},
		};
	})
);
