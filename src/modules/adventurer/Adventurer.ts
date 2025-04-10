import { useAdventurerStore } from "./AdventurerStore";
import { adventurer as AdventurerData } from "../../types/adventurer";
import { skill } from "../../types/skill";
import { stats } from "../../types/stats";
import { adventurerClass } from "../../types/avdventurerClass";

export class Adventurer {
	private skills: skill[];
	private class: adventurerClass | null;
	constructor(data: AdventurerData) {
		this.skills = data.activeSkills;
		this.class = data.class || null;
		const recordSkills = this.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		useAdventurerStore.getState().initCooldowns(recordSkills);
		useAdventurerStore.getState().initStats(data.stats);
		console.log("Adventurer created");
	}

	applyTick(delta: number) {
		this.regenerateMana(delta);
		this.reduceCooldowns(delta);
	}
	levelUp() {
		const stats = useAdventurerStore.getState().stats;
		const newStats = {
			...stats,
			health: stats.health + 10,
			mana: stats.mana + 5,
			strength: stats.strength + 1,
			dexterity: stats.dexterity + 1,
			intelligence: stats.intelligence + 1,
			level: stats.level + 1,
			experience: 0,
			experienceToLevelUp: stats.experienceToLevelUp * 1.2,
		};
		useAdventurerStore.getState().initStats(newStats);
	}
	getStats(): stats {
		return useAdventurerStore.getState().stats;
	}
	setStat(stat: keyof stats, value: number) {
		useAdventurerStore.getState().setStat(stat, value);
	}
	getStat(stat: keyof stats): number {
		return useAdventurerStore.getState().stats[stat];
	}

	getClass() {
		return this.class;
	}
	getClassName() {
		return this.class?.name || "Aucune classe";
	}

	getCurrentHealth() {
		return useAdventurerStore.getState().stats.health;
	}

	isAlive(): boolean {
		return useAdventurerStore.getState().stats.health > 0;
	}

	regenerateMana(delta: number) {
		const { manaRegen } = this.getStats();
		const manaBuffer = useAdventurerStore.getState().manaBuffer;
		const newMana = manaBuffer + manaRegen * delta;
		if (newMana >= 1) {
			useAdventurerStore.getState().regenMana(Math.floor(newMana));
			useAdventurerStore.getState().setManaBuffer(0);
		} else {
			useAdventurerStore.getState().setManaBuffer(newMana);
		}
	}

	reduceCooldowns(delta: number) {
		for (const [skillId, time] of Object.entries(this.getCooldowns())) {
			useAdventurerStore
				.getState()
				.setCooldown(skillId, Math.max(0, time - delta));
		}
	}

	isSkillAvailable(skillId: string): boolean {
		const skill = this.skills.find((s) => s.id === skillId);
		if (!skill) return false;
		const cooldown = this.getCooldown(skillId) ?? 0;
		return cooldown === 0 && this.getStat("mana") >= skill.manaCost;
	}

	getAvailableSkill(): skill | null {
		const usable = this.skills
			.filter((skill) => this.isSkillAvailable(skill.id))
			.sort((a, b) => b.cooldown - a.cooldown); // priorité cooldown
		return usable[0] || null;
	}

	applySkill(skill: skill) {
		useAdventurerStore.getState().useMana(skill.manaCost);
		this.setCooldown(skill.id, skill.cooldown);
	}

	applyDamage(amount: number) {
		this.setStat("health", Math.max(0, this.getCurrentHealth() - amount));
	}

	getCooldowns() {
		return useAdventurerStore.getState().cooldowns;
	}

	getCooldown(skillId: string): number {
		return useAdventurerStore.getState().cooldowns[skillId] || 0;
	}

	setCooldown(skillId: string, cooldown: number) {
		useAdventurerStore.getState().setCooldown(skillId, cooldown);
	}
}
