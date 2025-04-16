import { useAdventurerStore } from "../stores/AdventurerStore";
import { AdventurerData } from "../types/adventurer";
import { Skill } from "../types/skill";
import { CombatStats, BaseStatKeys } from "../types/stats";
import { DataUtil } from "../utils/DataUtil";
import { Class } from "../types/class";
import { PER_LEVEL_CONSTANTS, XP_CONSTANTS } from "../data/constant";
import { StatUtil } from "../utils/StatUtil";
import { MathUtil } from "../utils/MathUtil";
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
		const combatStats = StatUtil.calculateCombatStats(data.level);
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
		const combatStats = StatUtil.calculateCombatStats(state.level);
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
				useAdventurerStore.getState().regenMana(MathUtil.floorTo(newMana, 1));
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
}
