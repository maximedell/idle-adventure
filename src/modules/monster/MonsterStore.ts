import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface MonsterState {
	mana: Record<string, number>;
	health: Record<string, number>;
	cooldowns: Record<string, Record<string, number>>;
	manaBuffer: Record<string, number>;
	reviveBuffer: Record<string, number>;
}

interface MonsterActions {
	initStore: () => void; // Initialize the store with a specific area ID
	initMonster: (
		uid: string,
		recordSkills: Record<string, number>,
		health: number,
		mana: number
	) => void; // Initialize cooldowns for a specific monster
	initMana: (uid: string, mana: number) => void;
	initHealth: (uid: string, health: number) => void;
	applyDamage: (uid: string, amount: number) => void;
	useMana: (uid: string, amount: number) => void;
	regenMana: (uid: string, amount: number) => void;
	loseHealth: (uid: string, amount: number) => void;
	setCooldown: (uid: string, skillId: string, cooldown: number) => void;
	setManaBuffer: (uid: string, value: number) => void;
	setReviveBuffer: (uid: string, value: number) => void;
}

interface MonsterStore extends MonsterState, MonsterActions {}

export const useMonsterStore = create<MonsterStore>()(
	subscribeWithSelector((set) => {
		return {
			cooldowns: {},
			mana: {},
			health: {},
			manaBuffer: {},
			reviveBuffer: {},
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
			initMonster: (ui, recordSkills, health, mana) =>
				set((state) => ({
					cooldowns: {
						...state.cooldowns,
						[ui]: recordSkills,
					},
					health: {
						...state.health,
						[ui]: health,
					},
					mana: {
						...state.mana,
						[ui]: mana,
					},
				})),
			initMana: (uid, mana) =>
				set((state) => ({
					mana: {
						...state.mana,
						[uid]: mana,
					},
				})),
			initHealth: (uid, health) =>
				set((state) => ({
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
			setReviveBuffer: (uid, value) =>
				set((state) => ({
					reviveBuffer: {
						...state.reviveBuffer,
						[uid]: value,
					},
				})),
		};
	})
);
