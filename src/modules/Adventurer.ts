import { useAdventurerStore } from "../stores/AdventurerStore";
import { AdventurerData } from "../types/adventurer";
import { Skill } from "../types/skill";
import {
	LevelDependentStatKeys,
	BaseStatDependentStatKeys,
	CombatStats,
	GeneralStatKeys,
	BaseStatKeys,
} from "../types/stats";
import { useInventoryStore } from "../stores/InventoryStore";
import { DataUtil } from "../utils/DataUtil";
import { ClassUtil } from "../utils/ClassUtil";
import { Class } from "../types/class";
import {
	PER_LEVEL_CONSTANTS,
	XP_CONSTANTS,
	BASE_STATS_CONSTANTS,
	BASE_STAT_DEPENDENT_CONSTANTS,
} from "../data/constant";
export class Adventurer {
	private skills: Skill[] = [];

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
		const cooldowns = skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initAdventurer(
			data.strength,
			data.dexterity,
			data.intelligence,
			data.level,
			data.experience,
			data.currentHealth,
			data.currentMana,
			data.statPoints,
			data.talentPoints,
			data.classIds,
			data.activeSkillIds,
			data.unlockedSkillIds,
			data.unlockedTalentIds,
			cooldowns
		);
		if (!state.activeSkills.length) {
			for (const skill of skills) {
				state.addActiveSkill(skill.id);
			}
		}
		const combatStats = instance.calculateCombatStats(data.level);
		state.setCombatStats(combatStats);
		console.log("Adventurer created");
		return instance;
	}
	// Tick
	applyTick(delta: number) {
		this.regenerateMana(delta);
		this.reduceCooldowns(delta);
		this.updateGcd(delta);
	}

	// Getters from store
	getLevel(): number {
		return useAdventurerStore.getState().level;
	}
	getCurrentHealth() {
		return useAdventurerStore.getState().currentHealth;
	}

	getCurrentMana() {
		return useAdventurerStore.getState().currentMana;
	}

	getClassIds(): string[] {
		return useAdventurerStore.getState().classIds;
	}

	getClass(classId: string): Class | null {
		const classData = DataUtil.getClassById(classId);
		if (!classData) return null;
		return classData;
	}

	getClassName(): string {
		const classIds = this.getClassIds();
		if (classIds.length === 0) return "Aventurier";
		if (classIds.length === 1) {
			const classData = this.getClass(classIds[0]);
			if (!classData) return "Aventurier";
			return classData.name;
		} else {
			const sortedClassIds = classIds.sort().join(",");
			switch (sortedClassIds) {
				case "mage,warrior":
					return "Guerrier Arcaniste";
				case "assassin,warrior":
					return "Exécuteur";
				case "assassin,mage":
					return "Mage d'Ombre";
				default:
					return "Aventurier";
			}
		}
	}
	getBaseStatFromPoints(stat: BaseStatKeys): number {
		return useAdventurerStore.getState()[stat];
	}

	getCombatStats(): CombatStats {
		return useAdventurerStore.getState().combatStats;
	}

	getCombatStat(stat: keyof CombatStats): number {
		const combatStats = this.getCombatStats();
		if (!combatStats) return 0;
		return combatStats[stat] || 0;
	}

	// Setters from store
	levelUp() {
		let state = useAdventurerStore.getState();
		state.levelUp();
		state = useAdventurerStore.getState();

		state.addStatPoints(PER_LEVEL_CONSTANTS.statPoints);
		if (state.level % 5 === 0) {
			state.addTalentPoints(PER_LEVEL_CONSTANTS.talentPoints);
		}
		state = useAdventurerStore.getState();
		const combatStats = this.calculateCombatStats(state.level);
		state.setCombatStats(combatStats);

		state.setCurrentHealth(combatStats.maxHealth);
		state.setCurrentMana(combatStats.maxMana);
	}

	increaseStat(statKey: BaseStatKeys, amount: number) {
		const state = useAdventurerStore.getState();
		if (state.statPoints > amount) {
			state.addStat(statKey, amount);
			state.removeStatPoints(amount);
		}
	}

	setStat(statKey: BaseStatKeys, value: number) {
		useAdventurerStore.getState().setStat(statKey, value);
	}

	setCombatStats(combatStats: CombatStats) {
		useAdventurerStore.getState().setCombatStats(combatStats);
	}

	// stats calculations

	calculateCombatStats(level: number = this.getLevel()): CombatStats {
		const strength = this.calculateBaseStat("strength");
		const dexterity = this.calculateBaseStat("dexterity");
		const intelligence = this.calculateBaseStat("intelligence");

		return {
			level: level,
			dexterity: dexterity,
			strength: strength,
			intelligence: intelligence,
			maxHealth: this.calculateMaxHealth(),
			maxMana: this.calculateMaxMana(intelligence),
			manaRegen: this.calculateManaRegen(intelligence),
			armor: this.calculateArmor(strength),
			magicResist: this.calculateMagicResist(intelligence),
			criticalChance: this.calculateCriticalChance(dexterity),
			criticalDamageMultiplier:
				this.calculateCriticalDamageMultiplier(dexterity),
			damageMultiplierPhysical: this.calculateGeneralStat(
				"damageMultiplierPhysical"
			),
			damageMultiplierMagical: this.calculateGeneralStat(
				"damageMultiplierMagical"
			),
			defenseMultiplierPhysical: this.calculateGeneralStat(
				"defenseMultiplierPhysical"
			),
			defenseMultiplierMagical: this.calculateGeneralStat(
				"defenseMultiplierMagical"
			),
			cooldownReduction: this.calculateGeneralStat("cooldownReduction"),
		};
	}

	calculateBaseStats(stat: BaseStatKeys): number {
		return this.calculateBaseStat(stat);
	}
	calculateBaseStat(key: BaseStatKeys): number {
		const level = this.getLevel();
		let multiplier = 0;
		// Add the amount increase per level
		multiplier += this.calculateLevelDependentStat(key);
		multiplier += PER_LEVEL_CONSTANTS.baseStat;
		// Multiply by level the total amount per level
		let statValue = (level - 1) * multiplier;

		// Add from different sources
		statValue += this.getBaseStatFromPoints(key);
		statValue += this.calculateTalentStatFromClasses(key);
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return statValue;
	}

	calculateLevelDependentStat(stat: LevelDependentStatKeys): number {
		let statValue = 0;
		const classIds = useAdventurerStore.getState().classIds;
		for (const classId of classIds) {
			statValue += ClassUtil.getStatOnLevelUpFromClassId(stat, classId);
		}
		return statValue;
	}
	calculateTalentStatFromClasses(stat: keyof CombatStats): number {
		let statValue = 0;
		const classIds = useAdventurerStore.getState().classIds;
		for (const classId of classIds) {
			statValue += ClassUtil.getStatFromClassId(stat, classId);
		}
		return statValue;
	}

	calculateBaseStatDependentStatFromClasses(
		baseStat: BaseStatKeys,
		stat: BaseStatDependentStatKeys
	): number {
		let statValue = 0;
		const classIds = useAdventurerStore.getState().classIds;
		for (const classId of classIds) {
			statValue += ClassUtil.getBaseStatDependentStatFromClassId(
				baseStat,
				stat,
				classId
			);
		}
		return statValue;
	}

	calculateMaxHealth(): number {
		const level = this.getLevel();
		let multiplier = 0;
		// Add the amount increase per level
		multiplier += PER_LEVEL_CONSTANTS.health;
		multiplier += this.calculateLevelDependentStat("maxHealth");
		// Multiply by level the total amount per level
		let statValue = (level - 1) * multiplier;

		// Add from different sources
		statValue += BASE_STATS_CONSTANTS.maxHealth;
		statValue += this.calculateTalentStatFromClasses("maxHealth");
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat

		return Math.max(0, statValue);
	}

	calculateMaxMana(intelligence: number): number {
		let multiplier = 0;
		// Add the amount increase per intelligence
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.maxMana;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"intelligence",
			"maxMana"
		);
		// Multiply by intelligence the total amount per intelligence
		let statValue = intelligence * multiplier;
		// Add from different sources
		statValue += BASE_STATS_CONSTANTS.maxMana;
		statValue += this.calculateTalentStatFromClasses("maxMana");
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(0, statValue);
	}

	calculateManaRegen(intelligence: number): number {
		let multiplier = 0;
		// Add the amount increase per intelligence
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.manaRegen;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"intelligence",
			"manaRegen"
		);
		// Multiply by intelligence the total amount per intelligence
		let statValue = intelligence * multiplier;

		// Add from different sources
		statValue += BASE_STATS_CONSTANTS.manaRegen;
		statValue += this.calculateTalentStatFromClasses("manaRegen");
		// TODO: add calculateEquipmentStat
		// TODO: add calculatePassiveStat
		return Math.max(0, statValue);
	}

	calculateArmor(strength: number): number {
		let multiplier = 0;
		// Add the amount increase per strength
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.armor;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"strength",
			"armor"
		);
		// Multiply by strength the total amount per strength
		let statValue = strength * multiplier;

		// Add from different sources
		statValue += this.calculateTalentStatFromClasses("armor");
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(0, statValue);
	}

	calculateMagicResist(intelligence: number): number {
		let multiplier = 0;
		// Add the amount increase per intelligence
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.magicResist;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"intelligence",
			"magicResist"
		);
		// Multiply by intelligence the total amount per intelligence
		let statValue = intelligence * multiplier;
		// Add from different sources
		statValue += this.calculateTalentStatFromClasses("magicResist");
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(0, statValue);
	}
	calculateCriticalChance(dexterity: number): number {
		let multiplier = 0;
		// Add the amount increase per dexterity
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.criticalChance;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"dexterity",
			"criticalChance"
		);
		// Multiply by dexterity the total amount per dexterity
		let statValue = dexterity * multiplier;
		// Add from different sources
		statValue += this.calculateTalentStatFromClasses("criticalChance");
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(0, statValue);
	}
	calculateCriticalDamageMultiplier(dexterity: number): number {
		let multiplier = 0;
		// Add the amount increase per dexterity
		multiplier += BASE_STAT_DEPENDENT_CONSTANTS.criticalDamageMultiplier;
		multiplier += this.calculateBaseStatDependentStatFromClasses(
			"dexterity",
			"criticalDamageMultiplier"
		);
		// Multiply by dexterity the total amount per dexterity
		let statValue = dexterity * multiplier;
		// Add from different sources
		statValue += this.calculateTalentStatFromClasses(
			"criticalDamageMultiplier"
		);
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(0, statValue);
	}
	calculateGeneralStat(stat: GeneralStatKeys): number {
		let statValue = 0;
		statValue += this.calculateTalentStatFromClasses(stat);
		// TODO : add calculateEquipmentStat
		// TODO : add calculatePassiveStat
		return Math.max(1, statValue);
	}

	isAlive(): boolean {
		return this.getCurrentHealth() > 0;
	}

	regenerateMana(delta: number) {
		const currentMana = this.getCurrentMana();
		const maxMana = this.getCombatStat("maxMana");
		if (currentMana >= maxMana) return;
		const manaRegen = this.getCombatStat("manaRegen");
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
		return Math.floor(
			XP_CONSTANTS.baseXP * Math.pow(XP_CONSTANTS.levelExponent, level - 1)
		);
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
		let state = useInventoryStore.getState();
		const inventoryResources = state.resources;
		const inventorySizeMax = state.size;
		const inventorySize = Object.keys(inventoryResources).reduce(
			(acc, key) => acc + inventoryResources[key],
			0
		);
		const newResources: Record<string, number> = {};
		let currentSize = inventorySize;
		for (const resourceId in resources) {
			state = useInventoryStore.getState();
			if (currentSize >= inventorySizeMax) break;
			const quantity = resources[resourceId];
			if (quantity <= 0) continue;
			if (!state.discoveredResources.includes(resourceId))
				state.addDiscoveredResource(resourceId);
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
