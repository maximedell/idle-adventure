import { monster as MonsterData } from "../../types/monster";
import { skill } from "../../types/skill";
import { stats } from "../../types/stats";
import { useMonsterStore } from "./MonsterStore";

export class Monster {
	private data: MonsterData;
	private uid: string;
	private skills: skill[];
	private stats: stats;
	private recordSkills: Record<string, number>;
	constructor(data: MonsterData, uid: string) {
		const state = useMonsterStore.getState();
		this.uid = uid;
		this.data = { ...data };
		this.skills = this.data.activeSkills;
		this.stats = this.data.stats;
		this.recordSkills = this.skills.reduce((acc, skill) => {
			acc[skill.id] = 0;
			return acc;
		}, {} as Record<string, number>);
		state.initMonster(
			this.uid,
			this.recordSkills,
			this.stats.maxHealth,
			this.stats.maxMana
		);
		state.setManaBuffer(this.uid, 0);
		state.setReviveBuffer(this.uid, 0);
		console.log("Monster created", this.uid);
	}

	applyTick(delta: number) {
		if (!this.isAlive()) {
			this.revive(delta);
			return;
		}
		if (this.getCurrentMana() < this.getStats().maxMana) {
			this.regenerateMana(delta);
		}
		this.reduceCooldowns(delta);
	}
	getId(): string {
		return this.data.id;
	}
	getUid(): string {
		return this.uid;
	}
	getStats() {
		const stats = {
			...this.data.stats,
			health: useMonsterStore.getState().health[this.uid],
			mana: useMonsterStore.getState().mana[this.uid],
		};
		return stats;
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
		const { manaRegen } = this.getStats();
		const manaBuffer = useMonsterStore.getState().manaBuffer[this.uid];
		const newMana = manaBuffer + manaRegen * delta;
		if (newMana >= 1) {
			if (this.getCurrentMana() + newMana > this.getStats().maxMana) {
				useMonsterStore
					.getState()
					.regenMana(this.uid, this.getStats().maxMana - this.getCurrentMana());
			} else {
				useMonsterStore.getState().regenMana(this.uid, Math.floor(newMana));
			}
			useMonsterStore.getState().setManaBuffer(this.uid, 0);
		} else {
			useMonsterStore.getState().setManaBuffer(this.uid, newMana);
		}
	}
	reduceCooldowns(delta: number) {
		for (const [skillId, cooldown] of Object.entries(this.getCooldowns())) {
			if (!cooldown) continue;
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
	getAvailableSkill(): skill | null {
		const usable = this.skills
			.filter((skill) => this.isAvailableSkill(skill.id))
			.sort((a, b) => b.cooldown - a.cooldown); // priorité cooldown
		return usable[0] || null;
	}
	applySkill(skill: skill) {
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
	revive(delta: number) {
		if (this.isAlive()) return;
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
					this.stats.maxHealth,
					this.stats.maxMana
				);
		} else {
			useMonsterStore.getState().setReviveBuffer(this.uid, newReviveBuffer);
		}
	}
}
