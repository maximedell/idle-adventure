import { Adventurer } from "../../modules/Adventurer";
import { Monster } from "../../modules/Monster";
import { SkillEffect, Skill } from "../../types/skill";
import { SkillUtil } from "../../utils/SkillUtil";

interface SkillTooltipProps {
	skill: Skill;
	className?: string;
	owner?: Adventurer | Monster;
}

export default function SkillTooltip({
	skill,
	className,
	owner,
}: SkillTooltipProps) {
	return (
		<div className={`${className} flex flex-col`}>
			<span className="name">{skill.name}</span>
			<span className="description">{skill.description}</span>
			<span className="description">Coût en mana: {skill.manaCost}</span>
			<span className="description">
				{getCooldownDescription(skill, owner)}
			</span>
			<span className="description">Effets{owner && " caculés"}:</span>
			{skill.effects.map((effect, index) => (
				<span key={index} className="pl-2 description">
					{getDesciriptionFromEffect(effect, owner)}
				</span>
			))}
		</div>
	);
}

function getCooldownDescription(
	skill: Skill,
	owner?: Adventurer | Monster
): string {
	if (owner) {
		return `Temps de recharge: ${SkillUtil.getEffectiveCooldown(
			skill,
			owner.getCombatStats()
		)} secondes`;
	}
	return `Temps de recharge: ${skill.cooldown} secondes`;
}

function getDesciriptionFromEffect(
	effect: any,
	owner?: Adventurer | Monster
): string {
	switch (effect.type) {
		case "damage":
			return getDamageEffectDescription(effect, owner);
		default:
			return "Effet inconnu";
	}
}

function getDamageEffectDescription(
	effect: SkillEffect,
	owner?: Adventurer | Monster
): string {
	let dmg = effect.value;
	if (owner) {
		dmg = SkillUtil.getEffectiveDamage(effect, owner.getCombatStats());
	}
	const description = `Inflige ${dmg} dégâts ${
		effect.damageType === "physical" ? "physique" : "magique"
	} à ${effect.target} cible(s)`;
	return description;
}
