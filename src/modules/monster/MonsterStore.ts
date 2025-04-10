import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface MonsterState {
	mana: Record<string, number>; // Array of mana values for each monster
	health: Record<string, number>; // Array of health values for each monster
	cooldowns: Record<string, Record<string, number>>; // Array of cooldown maps for each monster
	manaBuffer: Record<string, number>; // Array of mana buffer values for each monster
}

interface MonsterActions {
	initStore: () => void; // Initialize the store with a specific area ID
	initMonsterCooldowns: (
		uid: string,
		recordSkills: Record<string, number>
	) => void; // Initialize cooldowns for a specific monster
	initMonsterStats: (uid: string, mana: number, health: number) => void; // Initialize stats for a specific monster
	applyDamage: (uid: string, amount: number) => void; // Apply damage to a specific monster
	useMana: (uid: string, amount: number) => void; // Use mana for a specific monster
	regenMana: (uid: string, amount: number) => void; // Regenerate mana for a specific monster
	loseHealth: (uid: string, amount: number) => void; // Lose health for a specific monster
	setCooldown: (uid: string, skillId: string, cooldown: number) => void; // Set cooldown for a specific skill of a monster
	setManaBuffer: (uid: string, value: number) => void; // Set mana buffer for a specific monster
}

interface MonsterStore extends MonsterState, MonsterActions {}

export const useMonsterStore = create<MonsterStore>()(
	subscribeWithSelector((set) => {
		return {
			cooldowns: {},
			mana: {},
			health: {},
			manaBuffer: {},
			setManaBuffer: (uid: string, value: number) =>
				set((state) => ({
					manaBuffer: {
						...state.manaBuffer,
						[uid]: value,
					},
				})),
			initStore: () =>
				set(() => ({
					cooldowns: {},
					mana: {},
					health: {},
				})),
			initMonsterCooldowns: (ui, recordSkills) =>
				set((state) => ({
					cooldowns: {
						...state.cooldowns,
						[ui]: recordSkills,
					},
				})),
			initMonsterStats: (uid, mana, health) =>
				set((state) => ({
					mana: {
						...state.mana,
						[uid]: mana,
					},
					health: {
						...state.health,
						[uid]: health,
					},
				})),

			applyDamage: (uid, amount) =>
				set((state) => ({
					health: {
						...state.health,
						[uid]: Math.max(0, state.health[uid] - amount),
					},
				})),
			useMana: (uid, amount) =>
				set((state) => ({
					mana: {
						...state.mana,
						[uid]: Math.max(0, state.mana[uid] - amount),
					},
				})),
			regenMana: (uid, amount) =>
				set((state) => ({
					mana: {
						...state.mana,
						[uid]: Math.min(state.mana[uid] + amount),
					},
				})),
			loseHealth: (uid, amount) =>
				set((state) => ({
					health: {
						...state.health,
						[uid]: Math.max(0, state.health[uid] - amount),
					},
				})),
			setCooldown: (uid, skillId, cooldown) =>
				set((state) => ({
					cooldowns: {
						...state.cooldowns,
						[uid]: {
							...state.cooldowns[uid],
							[skillId]: cooldown,
						},
					},
				})),
		};
	})
);
