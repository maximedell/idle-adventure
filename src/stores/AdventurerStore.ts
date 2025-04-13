import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type Stat = "strength" | "dexterity" | "intelligence";
interface AdventurerState {
	strength: number;
	dexterity: number;
	intelligence: number;
	level: number;
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
		strength: number,
		dexterity: number,
		intelligence: number,
		level: number,
		health: number,
		mana: number,
		currentClass: string,
		cooldowns: Record<string, number>
	) => void;
	setCooldown: (skillId: string, cooldown: number) => void;
	setStat: (stat: Stat, value: number) => void;
	addStat: (stat: Stat, value: number) => void;
	levelUp: () => void;
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
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			level: 1,
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
			setStat: (stat: Stat, value: number) =>
				set(
					(state) =>
						({
							[stat]: (state[stat] = value),
						} as Pick<AdventurerState, Stat>)
				),

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
				strength: number,
				dexterity: number,
				intelligence: number,
				level: number,
				health: number,
				mana: number,
				currentClass: string,
				cooldowns: Record<string, number>
			) =>
				set((state) => ({
					strength: (state.strength = strength),
					dexterity: (state.dexterity = dexterity),
					intelligence: (state.intelligence = intelligence),
					level: (state.level = level),
					currentHealth: (state.currentHealth = health),
					currentMana: (state.currentMana = mana),
					currentClass: (state.currentClass = currentClass),
					cooldowns: (state.cooldowns = cooldowns),
				})),
			levelUp: () =>
				set((state) => ({
					level: (state.level += 1),
				})),
			addStat: (stat: Stat, value: number) =>
				set(
					(state) =>
						({
							[stat]: (state[stat] += value),
						} as Pick<AdventurerState, Stat>)
				),
		};
	})
);
