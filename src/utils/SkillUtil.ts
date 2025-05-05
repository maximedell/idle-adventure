import { SkillEffect, Skill } from "../types/skill";
import { CombatStats } from "../types/stats";
import { MathUtil } from "./MathUtil";

export const SkillUtil = {
	getEffectiveCooldown(skill: Skill, stats: CombatStats): number {
		const cooldown = skill.cooldown / stats.cooldownReduction;
		return MathUtil.ceilTo(cooldown, 1);
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
			defenseMultiplier = target.defenseMultiplierPhysical;
			defenseFlat = target.armor;
		} else {
			defenseMultiplier = target.defenseMultiplierMagical;
			defenseFlat = target.magicResist;
		}
		let damage = (effectiveDamage - defenseFlat) * (1 / defenseMultiplier);
		damage = MathUtil.floorTo(damage, 1);
		return Math.max(damage, 0);
	},

	getEffectiveDamage(effect: SkillEffect, attacker: CombatStats): number {
		let damage = 0;
		if (effect.damageType === "physical") {
			const damageMultiplier = attacker.damageMultiplierPhysical;
			damage += effect.value * damageMultiplier;
		} else if (effect.damageType === "magical") {
			const damageMultiplier = attacker.damageMultiplierMagical;
			damage += effect.value * damageMultiplier;
		}
		damage = MathUtil.floorTo(damage, 1);
		return Math.max(damage, 0);
	},
};
