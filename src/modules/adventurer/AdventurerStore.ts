import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { stats } from "../../types/stats";
import { adventurerClass } from "../../types/avdventurerClass";

interface AdventurerState {
	stats: stats;
	cooldowns: Record<string, number>;
	class: string;
	manaBuffer: number;
}

interface AdventurerActions {
	initCooldowns: (recordSkills: Record<string, number>) => void;
	initStats: (stats: stats) => void;
	setCooldown: (skillId: string, cooldown: number) => void;
	setStat: (stat: string, value: number) => void;
	useMana: (amount: number) => void;
	regenMana: (amount: number) => void;
	loseHealth: (amount: number) => void;
	setManaBuffer: (value: number) => void;
}

interface AdventurerStore extends AdventurerState, AdventurerActions {}

export const useAdventurerStore = create<AdventurerStore>()(
	subscribeWithSelector((set) => {
		return {
			cooldowns: {},
			stats: {
				health: 100,
				mana: 50,
				strength: 10,
				dexterity: 10,
				intelligence: 10,
				level: 1,
				experience: 0,
				experienceToLevelUp: 100,
				maxHealth: 100,
				maxMana: 50,
				manaRegen: 1,
			},
			class: "",
			manaBuffer: 0,

			setManaBuffer: (value: number) =>
				set((state) => ({
					manaBuffer: (state.manaBuffer = value),
				})),
			initCooldowns: (recordSkills: Record<string, number>) =>
				set({ cooldowns: recordSkills }),
			initStats: (stats: stats) =>
				set((state) => ({
					stats: { ...state.stats, ...stats },
				})),
			setCooldown: (skillId: string, cooldown: number) =>
				set((state) => ({
					cooldowns: { ...state.cooldowns, [skillId]: cooldown },
				})),
			setStat: (stat: string, value: number) =>
				set((state) => ({
					stats: { ...state.stats, [stat]: value },
				})),
			useMana: (amount: number) =>
				set((state) => ({
					stats: { ...state.stats, mana: state.stats.mana - amount },
				})),
			regenMana: (amount: number) =>
				set((state) => ({
					stats: { ...state.stats, mana: state.stats.mana + amount },
				})),
			loseHealth: (amount: number) =>
				set((state) => ({
					stats: { ...state.stats, health: state.stats.health - amount },
				})),
		};
	})
);
