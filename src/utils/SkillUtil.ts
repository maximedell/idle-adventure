import { SkillEffect, Skill } from "../types/skill";
import { CombatStats } from "../types/stats";

export const SkillUtil = {
	getEffectiveCooldown(skill: Skill, stats: CombatStats): number {
		const cooldown =
			skill.cooldown *
			(1 - stats.dexterity * 0.01) *
			(1 - stats.cooldownReduction);
		return Math.floor(cooldown * 10) / 10;
	},

	getEffectiveDamageToTarget(
		effect: SkillEffect,
		attacker: CombatStats,
		target: CombatStats,
		critMultiplier: number = 1
	): number {
		let effectiveDamage = this.getEffectiveDamage(effect, attacker);
		let defenseMultiplier = 1;
		let defenseFlat = 0;
		effectiveDamage *= critMultiplier;

		if (effect.damageType === "physical") {
			defenseMultiplier =
				target.defenseMultiplierPhysical * (1 + target.strength / 100);
			defenseFlat = target.armor;
		} else {
			defenseMultiplier =
				target.defenseMultiplierMagical * (1 + target.intelligence / 100);
			defenseFlat = target.magicResist;
		}
		let damage = (effectiveDamage - defenseFlat) * (1 / defenseMultiplier);
		damage = Math.floor(damage * 10) / 10;
		return Math.max(damage, 0);
	},

	getEffectiveDamage(effect: SkillEffect, attacker: CombatStats): number {
		let damage = 0;
		if (effect.damageType === "physical") {
			const damageMultiplier =
				attacker.damageMultiplierPhysical * (1 + attacker.strength / 100);
			damage += effect.value * damageMultiplier;
		} else if (effect.damageType === "magical") {
			const damageMultiplier =
				attacker.damageMultiplierMagical * (1 + attacker.intelligence / 100);
			damage += effect.value * damageMultiplier;
		}
		damage = Math.floor(damage * 10) / 10;
		return Math.max(damage, 0);
	},

	getCriticalChance(stats: CombatStats): number {
		return stats.dexterity * 0.01 + stats.criticalChance;
	},

	getCriticalMultiplier(stats: CombatStats): number {
		return stats.criticalDamageMultiplier + stats.dexterity * 0.05;
	},
};
