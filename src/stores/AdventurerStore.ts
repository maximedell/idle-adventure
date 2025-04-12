import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { stats } from "../types/stats";

interface AdventurerState {
	stats: stats;
	cooldowns: Record<string, number>;
	currentClass: string;
	manaBuffer: number;
	activeSkills: string[];
	gcd: number; // global cooldown
	experience: number;
	currentHealth: number;
	currentMana: number;
}

interface AdventurerActions {
	initAdventurer: (
		stats: stats,
		health: number,
		mana: number,
		currentClass: string,
		cooldowns: Record<string, number>
	) => void;
	setCooldown: (skillId: string, cooldown: number) => void;
	setStat: (stat: string, value: number) => void;
	setStats: (stats: stats) => void;
	useMana: (amount: number) => void;
	regenMana: (amount: number) => void;
	loseHealth: (amount: number) => void;
	setManaBuffer: (value: number) => void;
	addActiveSkill: (skillId: string) => void;
	removeActiveSkill: (skillId: string) => void;
	setGcd: (value: number) => void;
	gainExperience: (amount: number) => void;
	setExperience: (value: number) => void;
	setCurrentHealth: (value: number) => void;
	setCurrentMana: (value: number) => void;
}

interface AdventurerStore extends AdventurerState, AdventurerActions {}

export const useAdventurerStore = create<AdventurerStore>()(
	subscribeWithSelector((set) => {
		return {
			cooldowns: {},
			stats: {
				strength: 0,
				dexterity: 0,
				intelligence: 1,
				level: 1,
			},
			currentHealth: 100,
			currentMana: 100,
			currentClass: "",
			manaBuffer: 0,
			activeSkills: [],
			gcd: 0,
			experience: 0,

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
			setCooldown: (skillId: string, cooldown: number) =>
				set((state) => ({
					cooldowns: { ...state.cooldowns, [skillId]: cooldown },
				})),
			setStat: (stat: string, value: number) =>
				set((state) => ({
					stats: { ...state.stats, [stat]: value },
				})),
			setStats: (stats: stats) =>
				set((state) => ({
					stats: { ...state.stats, ...stats },
				})),
			useMana: (amount: number) =>
				set((state) => ({
					currentMana: state.currentMana - amount,
				})),
			regenMana: (amount: number) =>
				set((state) => ({
					currentMana: state.currentMana + amount,
				})),
			loseHealth: (amount: number) =>
				set((state) => ({
					currentHealth: state.currentHealth - amount,
				})),
			setGcd: (value: number) =>
				set((state) => ({
					gcd: (state.gcd = value),
				})),
			gainExperience: (amount: number) =>
				set((state) => ({
					experience: (state.experience += amount),
				})),
			setExperience: (value: number) =>
				set((state) => ({
					experience: (state.experience = value),
				})),
			setCurrentHealth: (value: number) =>
				set((state) => ({
					currentHealth: (state.currentHealth = value),
				})),
			setCurrentMana: (value: number) =>
				set((state) => ({
					currentMana: (state.currentMana = value),
				})),

			initAdventurer: (
				stats: stats,
				health: number,
				mana: number,
				currentClass: string,
				cooldowns: Record<string, number>
			) =>
				set((state) => ({
					stats: { ...state.stats, ...stats },
					currentHealth: (state.currentHealth = health),
					currentMana: (state.currentMana = mana),
					currentClass: (state.currentClass = currentClass),
					cooldowns: (state.cooldowns = cooldowns),
				})),
		};
	})
);
