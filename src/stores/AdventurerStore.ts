import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CombatStats } from "../types/stats";

interface AdventurerState {
	strength: number;
	dexterity: number;
	intelligence: number;
	combatStats: CombatStats;
	combatStatsModifier: CombatStats;
	buffs: Record<string, number>;
	debuffs: Record<string, number>;
	level: number;
	cooldowns: Record<string, number>;
	manaBuffer: number;
	activeSkills: string[];
	unlockedSkills: string[];
	gcd: number; // global cooldown
	experience: number;
	currentHealth: number;
	currentMana: number;
	statPoints: number;
	talentPoints: number;
	classIds: string[];
	unlockedTalentIds: string[];
}

interface AdventurerActions {
	initAdventurer: (
		strength: number,
		dexterity: number,
		intelligence: number,
		level: number,
		experience: number,
		currentHealth: number,
		currentMana: number,
		statPoints: number,
		talentPoints: number,
		classIds: string[],
		activeSkills: string[],
		unlockedSkillIds: string[],
		unlockedTalentIds: string[],
		cooldowns: Record<string, number>
	) => void;
	setCooldown: (skillId: string, cooldown: number) => void;
	setStat: (
		stat: "strength" | "dexterity" | "intelligence",
		value: number
	) => void;
	addStat: (
		stat: "strength" | "dexterity" | "intelligence",
		value: number
	) => void;
	levelUp: () => void;
	useMana: (amount: number) => void;
	regenMana: (amount: number) => void;
	loseHealth: (amount: number) => void;
	setManaBuffer: (value: number) => void;
	addActiveSkill: (skillId: string) => void;
	removeActiveSkill: (skillId: string) => void;
	unlockSkill: (skillId: string) => void;
	setUnlockedSkills: (skills: string[]) => void;
	setGcd: (value: number) => void;
	gainExperience: (amount: number) => void;
	setExperience: (value: number) => void;
	setCurrentHealth: (value: number) => void;
	setCurrentMana: (value: number) => void;
	addStatPoints: (value: number) => void;
	removeStatPoints: (value: number) => void;
	addTalentPoints: (value: number) => void;
	removeTalentPoints: (value: number) => void;
	addClassId: (classId: string) => void;
	setUnlockedTalentIds: (ids: string[]) => void;
	unlockTalent: (id: string) => void;
	setCombatStats: (stats: CombatStats) => void;
	setCombatStatsModifier: (stats: CombatStats) => void;
	setBuff: (buffId: string, value: number) => void;
	setDebuff: (debuffId: string, value: number) => void;
	setBuffTimer: (buffId: string, value: number) => void;
	setDebuffTimer: (debuffId: string, value: number) => void;
	removeBuff: (buffId: string) => void;
	removeDebuff: (debuffId: string) => void;
}

interface AdventurerStore extends AdventurerState, AdventurerActions {}

export const useAdventurerStore = create<AdventurerStore>()(
	subscribeWithSelector((set) => {
		return {
			cooldowns: {},
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			combatStats: {
				level: 1,
				maxHealth: 100,
				maxMana: 100,
				armor: 0,
				magicResist: 0,
				criticalChance: 0,
				criticalDamageMultiplier: 0,
				damageMultiplierPhysical: 0,
				damageMultiplierMagical: 0,
				defenseMultiplierPhysical: 0,
				defenseMultiplierMagical: 0,
				strength: 0,
				dexterity: 0,
				intelligence: 0,
				manaRegen: 0,
				cooldownReduction: 0,
			},
			level: 1,
			currentHealth: 100,
			currentMana: 100,
			manaBuffer: 0,
			activeSkills: [],
			gcd: 0,
			experience: 0,
			statPoints: 5,
			talentPoints: 0,
			classIds: [],
			unlockedTalentIds: [],
			buffs: {},
			debuffs: {},
			combatStatsModifier: {
				level: 0,
				maxHealth: 0,
				maxMana: 0,
				armor: 0,
				magicResist: 0,
				criticalChance: 0,
				criticalDamageMultiplier: 0,
				damageMultiplierPhysical: 0,
				damageMultiplierMagical: 0,
				defenseMultiplierPhysical: 0,
				defenseMultiplierMagical: 0,
				strength: 0,
				dexterity: 0,
				intelligence: 0,
				manaRegen: 0,
				cooldownReduction: 0,
			},
			unlockedSkills: [],

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
			setStat: (
				stat: "strength" | "dexterity" | "intelligence",
				value: number
			) =>
				set((state) => ({
					[stat]: (state[stat] = value),
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
				strength: number,
				dexterity: number,
				intelligence: number,
				level: number,
				experience: number,
				health: number,
				mana: number,
				statPoints: number,
				talentPoints: number,
				classIds: string[],
				activeSkills: string[],
				unlockedSkillIds: string[],
				unlockedTalentIds: string[],
				cooldowns: Record<string, number>
			) =>
				set((state) => ({
					strength: (state.strength = strength),
					dexterity: (state.dexterity = dexterity),
					intelligence: (state.intelligence = intelligence),
					level: (state.level = level),
					experience: (state.experience = experience),
					currentHealth: (state.currentHealth = health),
					currentMana: (state.currentMana = mana),
					statPoints: (state.statPoints = statPoints),
					talentPoints: (state.talentPoints = talentPoints),
					classIds: (state.classIds = classIds),
					activeSkills: (state.activeSkills = activeSkills),
					unlockedSkills: (state.unlockedSkills = unlockedSkillIds),
					unlockedTalentIds: (state.unlockedTalentIds = unlockedTalentIds),
					cooldowns: (state.cooldowns = cooldowns),
				})),
			levelUp: () =>
				set((state) => ({
					level: (state.level += 1),
				})),
			addStat: (
				stat: "strength" | "dexterity" | "intelligence",
				value: number
			) =>
				set((state) => ({
					[stat]: state[stat] + value,
				})),
			addStatPoints: (value: number) =>
				set((state) => ({
					statPoints: (state.statPoints += value),
				})),
			removeStatPoints: (value: number) =>
				set((state) => ({
					statPoints: (state.statPoints -= value),
				})),
			addTalentPoints: (value: number) =>
				set((state) => ({
					talentPoints: (state.talentPoints += value),
				})),
			removeTalentPoints: (value: number) =>
				set((state) => ({
					talentPoints: (state.talentPoints -= value),
				})),
			addClassId: (classId: string) =>
				set((state) => ({
					classIds: [
						...state.classIds,
						...(state.classIds.includes(classId) ? [] : [classId]),
					],
				})),
			setUnlockedTalentIds: (ids: string[]) =>
				set((state) => ({
					unlockedTalentIds: (state.unlockedTalentIds = ids),
				})),
			unlockTalent: (id: string) =>
				set((state) => ({
					unlockedTalentIds: [
						...state.unlockedTalentIds,
						...(state.unlockedTalentIds.includes(id) ? [] : [id]),
					],
				})),
			setCombatStats: (stats: CombatStats) =>
				set((state) => ({
					combatStats: (state.combatStats = stats),
				})),
			setCombatStatsModifier: (stats: CombatStats) =>
				set((state) => ({
					combatStatsModifier: (state.combatStatsModifier = stats),
				})),
			setBuff: (buffId: string, value: number) =>
				set((state) => ({
					buffs: { ...state.buffs, [buffId]: value },
				})),
			setDebuff: (debuffId: string, value: number) =>
				set((state) => ({
					debuffs: { ...state.debuffs, [debuffId]: value },
				})),
			setBuffTimer: (buffId: string, value: number) =>
				set((state) => ({
					buffs: { ...state.buffs, [buffId]: value },
				})),
			setDebuffTimer: (debuffId: string, value: number) =>
				set((state) => ({
					debuffs: { ...state.debuffs, [debuffId]: value },
				})),
			removeBuff: (buffId: string) =>
				// remove the buff from the buffs object
				set((state) => ({
					buffs: Object.fromEntries(
						Object.entries(state.buffs).filter(([key]) => key !== buffId)
					),
				})),
			removeDebuff: (debuffId: string) =>
				// remove the debuff from the debuffs object
				set((state) => ({
					debuffs: Object.fromEntries(
						Object.entries(state.debuffs).filter(([key]) => key !== debuffId)
					),
				})),
			setUnlockedSkills: (skills: string[]) =>
				set((state) => ({
					unlockedSkills: (state.unlockedSkills = skills),
				})),
			unlockSkill: (skillId: string) =>
				set((state) => ({
					unlockedSkills: [
						...state.unlockedSkills,
						...(state.unlockedSkills.includes(skillId) ? [] : [skillId]),
					],
				})),
		};
	})
);
