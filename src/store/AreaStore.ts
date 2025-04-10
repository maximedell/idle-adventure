import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { monster } from "../types/monster";

interface AreaState {
	monstersByArea: Record<string, string[]>;
	activeArea: string;
	battleState: "idle" | "fighting";
}

interface AreaActions {
	setActiveArea(areaId: string): void;
	addArea(areaId: string, monsterUid: string): void;
	addMonsterToArea(areaId: string, monsterUid: string): void;
	setBattleState(state: "idle" | "fighting"): void;
}
interface AreaStore extends AreaState, AreaActions {}

export const useAreaStore = create<AreaStore>()(
	subscribeWithSelector((set) => {
		return {
			activeArea: "",
			battleState: "idle",
			monstersByArea: {},
			setActiveArea: (areaId: string) => {
				set({ activeArea: areaId });
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
			setBattleState: (state: "idle" | "fighting") => {
				set({ battleState: state });
			},
		};
	})
);
