import { useAdventurerStore } from "../stores/AdventurerStore";
import { AdventurerData } from "../types/adventurer";
import { Skill } from "../types/skill";
import { CombatStats } from "../types/stats";
import { useInventoryStore } from "../stores/InventoryStore";
import { DataUtil } from "../utils/DataUtil";

type Stat = "strength" | "dexterity" | "intelligence";
export class Adventurer {
	private skills: Skill[] = [];
	private baseManaRegen: number = 0.2;
	private baseMaxMana: number = 5;
	private baseMaxHealth: number = 100;
	private classId: string | null = null;

	constructor(private data: AdventurerData) {}

	static async create(data: AdventurerData): Promise<Adventurer> {
		const instance = new Adventurer(data);
		const state = useAdventurerStore.getState();
		const skills = await Promise.all(
			data.activeSkillIds.map(async (skillId) => {
				const skill = await DataUtil.getSkillById(skillId);
				if (!skill) {
					throw new Error(`Skill with id ${skillId} not found`);
				}
				return skill;
			})
		);
		instance.skills = skills;
		instance.classId = data.classId || null;
		const cooldowns = skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initAdventurer(
			data.strength,
			data.dexterity,
			data.intelligence,
			data.level,
			instance.getMaxHealth(data.level),
			instance.getMaxMana(data.intelligence),
			data.classId || "",
			cooldowns
		);
		if (!state.activeSkills.length) {
			for (const skill of skills) {
				state.addActiveSkill(skill.id);
			}
		}
		console.log("Adventurer created");
		return instance;
	}
	applyTick(delta: number) {
		this.regenerateMana(delta);
		this.reduceCooldowns(delta);
		this.updateGcd(delta);
	}
	getLevel(): number {
		return useAdventurerStore.getState().level;
	}

	levelUp() {
		let state = useAdventurerStore.getState();
		state.addStat("strength", 1);
		state.addStat("dexterity", 1);
		state.addStat("intelligence", 1);
		state.levelUp();
		state = useAdventurerStore.getState();
		state.setCurrentHealth(this.getMaxHealth(state.level));
		state.setCurrentMana(this.getMaxMana(state.intelligence));
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

	getStats(): Record<string, number> {
		return {
			strength: this.getStat("strength"),
			dexterity: this.getStat("dexterity"),
			intelligence: this.getStat("intelligence"),
		};
	}

	getCombatStats(): CombatStats {
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

	setStat(stat: Stat, value: number) {
		useAdventurerStore.getState().setStat(stat, value);
	}

	getStat(stat: Stat): number {
		switch (stat) {
			case "strength":
				return useAdventurerStore.getState().strength;
			case "dexterity":
				return useAdventurerStore.getState().dexterity;
			case "intelligence":
				return useAdventurerStore.getState().intelligence;
			default:
				throw new Error(`Stat ${stat} not found`);
		}
	}

	getClass() {
		return this.classId;
	}

	getClassName() {
		return this.classId || "Aucune classe";
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

	getActiveSkills(): Skill[] {
		const activeSkillIds = useAdventurerStore.getState().activeSkills;
		return this.skills.filter((skill) => activeSkillIds.includes(skill.id));
	}

	getAvailableSkill(): Skill | null {
		const gcd = useAdventurerStore.getState().gcd;
		if (gcd > 0) return null;
		const usable = this.getActiveSkills()
			.filter((skill) => this.isSkillAvailable(skill.id))
			.sort((a, b) => b.cooldown - a.cooldown); // priorité cooldown
		return usable[0] || null;
	}

	getSkills(): Skill[] {
		return this.skills;
	}

	useMana(amount: number) {
		useAdventurerStore.getState().useMana(amount);
	}

	setGcd(value: number) {
		useAdventurerStore.getState().setGcd(value);
	}

	applySkill(skill: Skill) {
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
		const xpToLevelUp = this.xpRequiredToLevelUp(state.level);
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
