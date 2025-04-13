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
		<div className={`${className} text-nowrap`}>
			<h3 className="text-lg font-bold">{skill.name}</h3>
			<p className="text-sm">{skill.description}</p>
			<p className="text-sm">Coût en mana: {skill.manaCost}</p>
			<p className="text-sm">{getCooldownDescription(skill, owner)}</p>
			<div className="mt-2">
				<h4 className="font-semibold">Effets{owner && " caculés"}:</h4>
				<ul className="list-none list-inside">
					{skill.effects.map((effect, index) => (
						<li key={index} className="text-sm text-nowrap">
							{getDesciriptionFromEffect(effect, owner)}
						</li>
					))}
				</ul>
			</div>
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
