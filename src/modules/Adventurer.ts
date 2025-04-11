import { useAdventurerStore } from "../stores/AdventurerStore";
import { adventurer as AdventurerData } from "../types/adventurer";
import { skill } from "../types/skill";
import { stats } from "../types/stats";
import { adventurerClass } from "../types/avdventurerClass";

export class Adventurer {
	private skills: skill[];

	private class: adventurerClass | null;
	constructor(data: AdventurerData) {
		const state = useAdventurerStore.getState();
		this.skills = data.activeSkills;
		this.class = data.class || null;
		const recordSkills = this.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initCooldowns(recordSkills);
		state.initStats(data.stats);
		if (!state.activeSkills.length) {
			for (const skill of this.skills) {
				state.addActiveSkill(skill.id);
			}
		}
		console.log("Adventurer created");
	}

	applyTick(delta: number) {
		this.regenerateMana(delta);
		this.reduceCooldowns(delta);
		this.updateGcd(delta);
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
	getCurrentMana() {
		return useAdventurerStore.getState().stats.mana;
	}

	isAlive(): boolean {
		return this.getCurrentHealth() > 0;
	}

	regenerateMana(delta: number) {
		if (this.getCurrentMana() >= this.getStats().maxMana) return;
		const { manaRegen } = this.getStats();
		const manaBuffer = useAdventurerStore.getState().manaBuffer;
		const newMana = manaBuffer + manaRegen * delta;
		if (newMana >= 1) {
			if (this.getCurrentMana() + newMana > this.getStats().maxMana) {
				useAdventurerStore
					.getState()
					.regenMana(this.getStats().maxMana - this.getCurrentMana());
			} else {
				useAdventurerStore.getState().regenMana(Math.floor(newMana));
			}
			useAdventurerStore.getState().setManaBuffer(0);
		} else {
			useAdventurerStore.getState().setManaBuffer(newMana);
		}
	}

	reduceCooldowns(delta: number) {
		for (const [skillId, time] of Object.entries(this.getCooldowns()).filter(
			([, time]) => time > 0
		)) {
			useAdventurerStore
				.getState()
				.setCooldown(skillId, Math.max(0, time - delta));
		}
	}

	updateGcd(delta: number) {
		const gcd = useAdventurerStore.getState().gcd;
		if (gcd > 0) {
			this.setGcd(Math.max(0, gcd - delta));
		}
	}

	isSkillAvailable(skillId: string): boolean {
		const skill = this.skills.find((s) => s.id === skillId);
		if (!skill) return false;
		const cooldown = this.getCooldown(skillId) ?? 0;
		return cooldown === 0 && this.getStat("mana") >= skill.manaCost;
	}

	getActiveSkills(): skill[] {
		const activeSkillIds = useAdventurerStore.getState().activeSkills;
		return this.skills.filter((skill) => activeSkillIds.includes(skill.id));
	}

	getAvailableSkill(): skill | null {
		const gcd = useAdventurerStore.getState().gcd;
		if (gcd > 0) return null;
		const usable = this.getActiveSkills()
			.filter((skill) => this.isSkillAvailable(skill.id))
			.sort((a, b) => b.cooldown - a.cooldown); // priorité cooldown
		return usable[0] || null;
	}
	getSkills(): skill[] {
		return this.skills;
	}
	useMana(amount: number) {
		useAdventurerStore.getState().useMana(amount);
	}
	setGcd(value: number) {
		useAdventurerStore.getState().setGcd(value);
	}
	applySkill(skill: skill) {
		this.useMana(skill.manaCost);
		this.setCooldown(skill.id, skill.cooldown);
		this.setGcd(1);
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
