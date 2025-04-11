import { useAdventurerStore } from "../stores/AdventurerStore";

export const useAdventurerStats = () => {
	return useAdventurerStore((state) => state.stats);
};

export const useAdventurerClass = () => {
	const adventurerClass = useAdventurerStore((state) => state.class);
	if (!adventurerClass) return "Aventurier";
	return adventurerClass;
};

export const useAdventurerActiveSkills = () => {
	const skills = useAdventurerStore((state) => state.activeSkills);
	if (!skills) return [];

	return skills;
};

export const useAdventurerCurrentHealth = () => {
	const currentHealth = useAdventurerStore((state) => state.stats.health);
	if (currentHealth === undefined) return null;

	return currentHealth;
};

export const useAdventurerMaxHealth = () => {
	const maxHealth = useAdventurerStore((state) => state.stats.maxHealth);
	if (maxHealth === undefined) return null;

	return maxHealth;
};

export const useAdventurerCurrentMana = () => {
	const currentMana = useAdventurerStore((state) => state.stats.mana);
	if (currentMana === undefined) return null;

	return currentMana;
};

export const useAdventurerMaxMana = () => {
	const maxMana = useAdventurerStore((state) => state.stats.maxMana);
	if (maxMana === undefined) return null;

	return maxMana;
};

export const useAdventurerLevel = () => {
	const level = useAdventurerStore((state) => state.stats.level);
	if (level === undefined) return null;

	return level;
};

export const useAdventurerExperience = () => {
	const experience = useAdventurerStore((state) => state.experience);
	if (experience === undefined) return 0;

	return experience;
};

export const useAdventurerSkillCooldown = (skillId: string) => {
	const cooldown = useAdventurerStore((state) => state.cooldowns[skillId]);
	if (cooldown === undefined) return 0;

	return cooldown;
};
