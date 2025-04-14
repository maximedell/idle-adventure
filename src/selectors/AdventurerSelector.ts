import { useShallow } from "zustand/shallow";
import { useAdventurerStore } from "../stores/AdventurerStore";

export const useAdventurerLevel = () => {
	return useAdventurerStore((state) => state.level);
};
export const useAdventurerStrength = () => {
	return useAdventurerStore((state) => state.strength);
};
export const useAdventurerDexterity = () => {
	return useAdventurerStore((state) => state.dexterity);
};
export const useAdventurerIntelligence = () => {
	return useAdventurerStore((state) => state.intelligence);
};

export const useAdventurerActiveSkills = () => {
	const skills = useAdventurerStore((state) => state.activeSkills);
	if (!skills) return [];

	return skills;
};

export const useAdventurerCurrentHealth = () => {
	return useAdventurerStore((state) => state.currentHealth);
};

export const useAdventurerCurrentMana = () => {
	return useAdventurerStore((state) => state.currentMana);
};

export const useAdventurerExperience = () => {
	return useAdventurerStore((state) => state.experience);
};

export const useAdventurerSkillCooldown = (skillId: string) => {
	const cooldown = useAdventurerStore((state) => state.cooldowns[skillId]);
	if (cooldown === undefined) return 0;

	return cooldown;
};

export const useAdventurerStatPoints = () => {
	return useAdventurerStore((state) => state.statPoints);
};

export const useAdventurerStats = () => {
	return useAdventurerStore(
		useShallow((state) => ({
			strength: state.strength,
			dexterity: state.dexterity,
			intelligence: state.intelligence,
		}))
	);
};

export const useAdventurerClassIds = () => {
	return useAdventurerStore((state) => state.classIds);
};

export const useAdventurerTalentPoints = () => {
	return useAdventurerStore((state) => state.talentPoints);
};

export const useAdventurerUnlockedTalents = () => {
	return useAdventurerStore((state) => state.unlockedTalentIds);
};

export const useAdventurerCombatStats = () => {
	return useAdventurerStore((state) => state.combatStats);
};
