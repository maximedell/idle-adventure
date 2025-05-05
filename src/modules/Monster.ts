import { MonsterData } from "../types/monster";
import { Skill } from "../types/skill";
import { CombatStats } from "../types/stats";
import { useMonsterStore } from "../stores/MonsterStore";
import { DataUtil } from "../utils/DataUtil";
import { MathUtil } from "../utils/MathUtil";
import { StatUtil } from "../utils/StatUtil";

export class Monster {
	private data: MonsterData;
	private uid: string;
	private skills: Skill[] = [];
	private stats: CombatStats = {} as CombatStats;

	constructor(data: MonsterData, uid: string) {
		this.uid = uid;
		this.data = { ...data };
	}
	static async create(data: MonsterData, uid: string): Promise<Monster> {
		const instance = new Monster(data, uid);
		const state = useMonsterStore.getState();
		instance.data = { ...data };
		instance.skills = await instance.getSkillsData();
		instance.uid = uid;
		instance.stats = StatUtil.calculateMonsterCombatStats(data.stats);
		instance.initMonster();
		state.setManaBuffer(uid, 0);
		state.setReviveBuffer(uid, 0);
		console.log("Monster created", uid);
		return instance;
	}
	async getSkillsData(): Promise<Skill[]> {
		return await Promise.all(
			this.data.activeSkillIds.map(async (skillId) => {
				const skill = await DataUtil.getSkillById(skillId);
				if (!skill) {
					throw new Error(`Skill with id ${skillId} not found`);
				}
				return skill;
			})
		);
	}
	getInitialCooldowns(): Record<string, number> {
		return this.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
	}
	initMonster() {
		useMonsterStore
			.getState()
			.initMonster(
				this.uid,
				this.getInitialCooldowns(),
				this.stats.maxHealth,
				this.stats.maxMana
			);
	}
	applyTick(delta: number) {
		if (!this.isAlive()) {
			this.respawn(delta);
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
		return this.stats.level;
	}
	getCombatStats(): CombatStats {
		return this.stats;
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
		const maxMana = this.getStats().maxMana;
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
				useMonsterStore
					.getState()
					.regenMana(this.uid, MathUtil.floorTo(newMana, 1));
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
		this.setGcd(1);
		this.useMana(skill.manaCost);
		this.setCooldown(skill.id, skill.cooldown);
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
	respawn(delta: number) {
		const state = useMonsterStore.getState();
		if (this.isAlive() || !state.respawnMonsters) return;
		const reviveBuffer = state.reviveBuffer[this.uid];
		const reviveTime = this.data.reviveTime;
		const newReviveBuffer = reviveBuffer + delta;
		if (newReviveBuffer >= reviveTime) {
			state.setReviveBuffer(this.uid, 0);
			this.initMonster();
		} else {
			state.setReviveBuffer(this.uid, newReviveBuffer);
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
}
