import { CombatStats } from "../../types/stats";
import { StatUtil } from "../../utils/StatUtil";

interface CombatStatsProps {
	combatStats: CombatStats;
}

export default function CombatStatsComponent({
	combatStats,
}: CombatStatsProps) {
	return (
		<div className="grid grid-flow-row grid-cols-2 gap-2">
			<ul className="list-category">
				<span className="list-title">Statistiques</span>
				<li>
					<span className="list-name">Force:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"strength" as keyof CombatStats,
							combatStats.strength,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Dextérité:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"dexterity" as keyof CombatStats,
							combatStats.dexterity,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Intelligence:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"intelligence" as keyof CombatStats,
							combatStats.intelligence,
							2
						)}
					</span>
				</li>
			</ul>
			<ul className="list-category">
				<span className="list-title">Points de vie</span>
				<li>
					<span className="list-name">Max:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"maxHealth" as keyof CombatStats,
							combatStats.maxHealth,
							2
						)}
					</span>
				</li>
			</ul>
			<ul className="list-category">
				<span className="list-title">Mana</span>
				<li>
					<span className="list-name">Max:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"maxMana" as keyof CombatStats,
							combatStats.maxMana,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Régénération:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"manaRegen" as keyof CombatStats,
							combatStats.manaRegen,
							2
						)}
					</span>
				</li>
			</ul>
			<ul className="list-category">
				<span className="list-title">Temps de recharge</span>
				<li>
					<span className="list-name">Réduction:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"cooldownReduction" as keyof CombatStats,
							combatStats.cooldownReduction,
							2
						)}
					</span>
				</li>
			</ul>
			<ul className="list-category">
				<span className="list-title">Dégat</span>
				<li>
					<span className="list-name">Physique:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"damageMultiplierPhysical" as keyof CombatStats,
							combatStats.damageMultiplierPhysical,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Magique:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"damageMultiplierMagical" as keyof CombatStats,
							combatStats.damageMultiplierMagical,
							2
						)}
					</span>
				</li>
				<ul>
					<span className="list-title">Critique</span>
					<li>
						<span className="list-name">Chance:</span>
						<span className="list-description">
							{StatUtil.getStatValueText(
								"criticalChance" as keyof CombatStats,
								combatStats.criticalChance,
								2
							)}
						</span>
					</li>
					<li>
						<span className="list-name">Dégat:</span>
						<span className="list-description">
							{StatUtil.getStatValueText(
								"criticalDamageMultiplier" as keyof CombatStats,
								combatStats.criticalDamageMultiplier,
								2
							)}
						</span>
					</li>
				</ul>
			</ul>
			<ul className="list-category">
				<span className="list-title">Défense</span>
				<li>
					<span className="list-name">Physique:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"defenseMultiplierPhysical" as keyof CombatStats,
							combatStats.defenseMultiplierPhysical,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Magique:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"defenseMultiplierMagical" as keyof CombatStats,
							combatStats.defenseMultiplierMagical,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Armure:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"armor" as keyof CombatStats,
							combatStats.armor,
							2
						)}
					</span>
				</li>
				<li>
					<span className="list-name">Résistance magique:</span>
					<span className="list-description">
						{StatUtil.getStatValueText(
							"magicResist" as keyof CombatStats,
							combatStats.magicResist,
							2
						)}
					</span>
				</li>
			</ul>
		</div>
	);
}
