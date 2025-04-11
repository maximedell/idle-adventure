import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { stats } from "../types/stats";

interface AdventurerState {
	stats: stats;
	cooldowns: Record<string, number>;
	class: string;
	manaBuffer: number;
	activeSkills: string[];
	gcd: number; // global cooldown
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
	addActiveSkill: (skillId: string) => void;
	removeActiveSkill: (skillId: string) => void;
	setGcd: (value: number) => void;
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
			activeSkills: [],
			gcd: 0,

			addActiveSkill: (skillId: string) =>
				set((state) => ({
					activeSkills: [...state.activeSkills, skillId],
				})),
			removeActiveSkill: (skillId: string) =>
				set((state) => ({
					activeSkills: state.activeSkills.filter((skill) => skill !== skillId),
				})),

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
			setGcd: (value: number) =>
				set((state) => ({
					gcd: (state.gcd = value),
				})),
		};
	})
);
