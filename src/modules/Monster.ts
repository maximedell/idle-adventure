import { MonsterData } from "../types/monster";
import { Skill } from "../types/skill";
import { CombatStats } from "../types/stats";
import { useMonsterStore } from "../stores/MonsterStore";
import { DataUtil } from "../utils/DataUtil";

export class Monster {
	private data: MonsterData;
	private uid: string;
	private skills: Skill[] = [];
	private level: number = 1;
	private stats: CombatStats = {} as CombatStats;
	private recordSkills: Record<string, number> = {};

	constructor(data: MonsterData, uid: string) {
		this.uid = uid;
		this.data = { ...data };
	}
	static async create(data: MonsterData, uid: string): Promise<Monster> {
		const instance = new Monster(data, uid);
		const state = useMonsterStore.getState();
		instance.data = { ...data };
		instance.skills = await Promise.all(
			data.activeSkillIds.map(async (skillId) => {
				const skill = await DataUtil.getSkillById(skillId);
				if (!skill) {
					throw new Error(`Skill with id ${skillId} not found`);
				}
				return skill;
			})
		);
		instance.stats = data.stats;
		instance.level = data.level;
		instance.recordSkills = instance.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initMonster(
			uid,
			instance.recordSkills,
			instance.stats.health,
			instance.stats.mana
		);
		state.setManaBuffer(uid, 0);
		state.setReviveBuffer(uid, 0);
		console.log("Monster created", uid);
		return instance;
	}
	applyTick(delta: number) {
		if (!this.isAlive()) {
			this.revive(delta);
		}
		this.regenerateMana(delta);
		this.reduceCooldowns(delta);
		this.updateGcd(delta);
	}
	getId(): string {
		return this.data.id;
	}
	getUid(): string {
		return this.uid;
	}
	getStats(): CombatStats {
		return this.stats;
	}
	getLevel(): number {
		return this.level;
	}
	getCombatStats(): CombatStats {
		const stats = {
			...this.data.stats,
		};
		return {
			strength: stats.strength,
			dexterity: stats.dexterity,
			intelligence: stats.intelligence,
			health: this.getCurrentHealth(),
			maxHealth: this.stats.health,
			mana: this.getCurrentMana(),
			maxMana: this.stats.mana,
			manaRegen: this.stats.manaRegen,
			armor: stats.armor,
			magicResist: stats.magicResist,
			damageMultiplierPhysical: stats.damageMultiplierPhysical,
			damageMultiplierMagical: stats.damageMultiplierMagical,
			defenseMultiplierPhysical: stats.defenseMultiplierPhysical,
			defenseMultiplierMagical: stats.defenseMultiplierMagical,
			cooldownReduction: stats.cooldownReduction,
			criticalChance: stats.criticalChance,
			criticalDamageMultiplier: stats.criticalDamageMultiplier,
		};
	}
	getCurrentHealth() {
		return useMonsterStore.getState().health[this.uid];
	}
	getCurrentMana() {
		return useMonsterStore.getState().mana[this.uid];
	}

	isAlive(): boolean {
		return this.getCurrentHealth() > 0;
	}

	applyDamage(amount: number) {
		useMonsterStore.getState().applyDamage(this.uid, amount);
	}
	useMana(amount: number) {
		useMonsterStore.getState().useMana(this.uid, amount);
	}

	regenerateMana(delta: number) {
		const maxMana = this.getStats().mana;
		if (maxMana === 0) return;
		const currentMana = this.getCurrentMana();
		if (currentMana >= maxMana) return;
		if (!this.isAlive()) return;
		const { manaRegen } = this.getStats();
		const manaBuffer = useMonsterStore.getState().manaBuffer[this.uid];
		const newMana = manaBuffer + manaRegen * delta;
		if (newMana >= 1) {
			if (currentMana + newMana > maxMana) {
				useMonsterStore.getState().regenMana(this.uid, maxMana - currentMana);
			} else {
				useMonsterStore.getState().regenMana(this.uid, Math.floor(newMana));
			}
			useMonsterStore.getState().setManaBuffer(this.uid, 0);
		} else {
			useMonsterStore.getState().setManaBuffer(this.uid, newMana);
		}
	}
	reduceCooldowns(delta: number) {
		const cooldowns = useMonsterStore.getState().cooldowns[this.uid];
		if (!cooldowns) return;
		const cooldownsFiltered = Object.entries(cooldowns).filter(
			([, cooldown]) => cooldown > 0
		);
		if (cooldownsFiltered.length === 0) return;
		for (const [skillId, cooldown] of cooldownsFiltered) {
			useMonsterStore
				.getState()
				.setCooldown(this.uid, skillId, Math.max(0, cooldown - delta));
		}
	}
	getCooldowns() {
		return useMonsterStore.getState().cooldowns[this.uid];
	}
	loseHealth(amount: number) {
		useMonsterStore.getState().loseHealth(this.uid, amount);
	}
	setCooldown(skillId: string, cooldown: number) {
		useMonsterStore.getState().setCooldown(this.uid, skillId, cooldown);
	}
	getCooldown(skillId: string): number {
		return useMonsterStore.getState().cooldowns[this.uid][skillId] || 0;
	}
	isAvailableSkill(skillId: string): boolean {
		const skill = this.skills.find((s) => s.id === skillId);
		if (!skill) return false;
		const cooldown = this.getCooldown(skillId) ?? 0;
		return cooldown === 0 && this.getCurrentMana() >= skill.manaCost;
	}
	getAvailableSkill(): Skill | null {
		const gcd = useMonsterStore.getState().gcd[this.uid];
		if (gcd > 0) return null;
		const usable = this.skills
			.filter((skill) => this.isAvailableSkill(skill.id))
			.sort((a, b) => b.cooldown - a.cooldown); // priorité cooldown
		return usable[0] || null;
	}
	setGcd(value: number) {
		useMonsterStore.getState().setGcd(this.uid, value);
	}
	applySkill(skill: Skill) {
		this.useMana(skill.manaCost);
		this.setCooldown(skill.id, skill.cooldown);
		this.setGcd(1);
	}

	getData(): MonsterData {
		return this.data;
	}

	getRewards() {
		return this.data.rewards;
	}
	getName() {
		return this.data.name;
	}
	revive(delta: number) {
		if (this.isAlive() || !useMonsterStore.getState().respawnMonsters) return;
		const reviveBuffer = useMonsterStore.getState().reviveBuffer[this.uid];
		const reviveTime = this.data.reviveTime;
		const newReviveBuffer = reviveBuffer + delta;
		if (newReviveBuffer >= reviveTime) {
			useMonsterStore.getState().setReviveBuffer(this.uid, 0);
			useMonsterStore
				.getState()
				.initMonster(
					this.uid,
					this.recordSkills,
					this.stats.health,
					this.stats.mana
				);
		} else {
			useMonsterStore.getState().setReviveBuffer(this.uid, newReviveBuffer);
		}
	}
	getSkills() {
		return this.skills;
	}
	updateGcd(delta: number) {
		const gcd = useMonsterStore.getState().gcd[this.uid];
		if (gcd > 0) {
			this.setGcd(Math.max(0, gcd - delta));
		}
	}
	respawn() {}
}
