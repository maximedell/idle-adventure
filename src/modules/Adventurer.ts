import { useAdventurerStore } from "../stores/AdventurerStore";
import { adventurer as AdventurerData } from "../types/adventurer";
import { skill } from "../types/skill";
import { combatStats, stats } from "../types/stats";
import { adventurerClass } from "../types/avdventurerClass";
import { useInventoryStore } from "../stores/InventoryStore";

export class Adventurer {
	private skills: skill[];
	private baseManaRegen: number = 0.2;
	private baseMaxMana: number = 5;
	private baseMaxHealth: number = 100;
	private class: adventurerClass | null;
	constructor(data: AdventurerData) {
		const state = useAdventurerStore.getState();
		this.skills = data.activeSkills;
		this.class = data.class || null;
		const cooldowns = this.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initAdventurer(
			data.stats,
			this.getMaxHealth(data.stats.level),
			this.getMaxMana(data.stats.intelligence),
			data.class?.id || "",
			cooldowns
		);
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
			strength: stats.strength + 1,
			dexterity: stats.dexterity + 1,
			intelligence: stats.intelligence + 1,
			level: stats.level + 1,
		};
		useAdventurerStore.getState().setStats(newStats);
		useAdventurerStore
			.getState()
			.setCurrentMana(this.getMaxMana(newStats.intelligence));
		useAdventurerStore
			.getState()
			.setCurrentHealth(this.getMaxHealth(newStats.level));
	}

	getMaxHealth(level: number): number {
		return this.baseMaxHealth + 50 * (level - 1);
	}

	getMaxMana(intelligence: number): number {
		return this.baseMaxMana + intelligence * 2;
	}

	getManaRegen(intelligence: number): number {
		return this.baseManaRegen + intelligence * 0.1;
	}

	getStats(): stats {
		return useAdventurerStore.getState().stats;
	}

	getCombatStats(): combatStats {
		const stats = this.getStats();
		return {
			health: this.getCurrentHealth(),
			mana: this.getCurrentMana(),
			strength: stats.strength,
			dexterity: stats.dexterity,
			intelligence: stats.intelligence,
			maxHealth: this.getMaxHealth(stats.level),
			maxMana: this.getMaxMana(stats.intelligence),
			manaRegen: this.getManaRegen(stats.intelligence),
			damageMultiplierPhysical: 1,
			damageMultiplierMagical: 1,
			defenseMultiplierPhysical: 1,
			defenseMultiplierMagical: 1,
			cooldownReduction: 0,
			armor: this.getArmor(),
			magicResist: this.getMagicResist(),
			criticalChance: 0,
			criticalDamageMultiplier: 0,
		};
	}

	getArmor(): number {
		return this.getStats().strength * 0.1;
	}

	getMagicResist(): number {
		return this.getStats().intelligence * 0.1;
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
		return useAdventurerStore.getState().currentHealth;
	}

	getCurrentMana() {
		return useAdventurerStore.getState().currentMana;
	}

	isAlive(): boolean {
		return this.getCurrentHealth() > 0;
	}

	regenerateMana(delta: number) {
		const currentMana = this.getCurrentMana();
		const maxMana = this.getMaxMana(this.getStat("intelligence"));
		if (currentMana >= maxMana) return;
		const manaRegen = this.getManaRegen(this.getStat("intelligence"));
		const manaBuffer = useAdventurerStore.getState().manaBuffer;
		const newMana = manaBuffer + manaRegen * delta;
		if (newMana >= 0.1) {
			if (currentMana + newMana > maxMana) {
				useAdventurerStore.getState().regenMana(maxMana - currentMana);
			} else {
				useAdventurerStore.getState().regenMana(Math.floor(newMana * 10) / 10);
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
		return cooldown === 0 && this.getCurrentMana() >= skill.manaCost;
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
		useAdventurerStore.getState().loseHealth(amount);
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

	xpRequiredToLevelUp(level: number): number {
		return Math.floor(100 * Math.pow(1.2, level - 1));
	}

	gainExperience(amount: number) {
		if (amount <= 0) return;
		amount = Math.floor(amount);
		const state = useAdventurerStore.getState();
		const currentXp = state.experience;
		const xpToLevelUp = this.xpRequiredToLevelUp(state.stats.level);
		if (currentXp + amount >= xpToLevelUp) {
			const xpLeft = currentXp + amount - xpToLevelUp;
			this.levelUp();
			state.setExperience(xpLeft);
		} else {
			state.gainExperience(amount);
		}
	}

	addResourcesToInventory(
		resources: Record<string, number>
	): Record<string, number> {
		const state = useInventoryStore.getState();
		const inventoryResources = state.resources;
		const inventorySizeMax = state.size;
		const inventorySize = Object.keys(inventoryResources).reduce(
			(acc, key) => acc + inventoryResources[key],
			0
		);
		const newResources: Record<string, number> = {};
		let currentSize = inventorySize;
		for (const resourceId in resources) {
			if (currentSize >= inventorySizeMax) break;
			const quantity = resources[resourceId];
			if (currentSize + quantity <= inventorySizeMax) {
				newResources[resourceId] = quantity;
				currentSize += quantity;
			} else {
				newResources[resourceId] = inventorySizeMax - currentSize;
				currentSize = inventorySizeMax;
			}
		}
		for (const resourceId in newResources) {
			const quantity = newResources[resourceId];
			state.addResource(resourceId, quantity);
		}
		return newResources;
	}
}
