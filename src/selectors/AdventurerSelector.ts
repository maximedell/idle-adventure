import { useAdventurerStore } from "../stores/AdventurerStore";

export const useAdventurerStats = () => {
	return useAdventurerStore((state) => state.stats);
};

export const useAdventurerClass = () => {
	const adventurerClass = useAdventurerStore((state) => state.currentClass);
	if (!adventurerClass) return "Aventurier";
	return adventurerClass;
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
