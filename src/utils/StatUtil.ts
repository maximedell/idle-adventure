import { stats, monsterStats, combatStats } from "../types/stats";

export const StatUtil = {
	getStatName(stat: string): string {
		switch (stat) {
			case "strength":
				return "Force";
			case "dexterity":
				return "Dextérité";
			case "intelligence":
				return "Intelligence";
			case "level":
				return "Niveau";
			case "health":
				return "Points de vie";
			case "mana":
				return "Mana";
			case "manaRegen":
				return "Régénération de mana";
			case "armor":
				return "Armure";
			case "magicResist":
				return "Résistance magique";
			case "damageMultiplierPhysical":
				return "Multiplicateur de dégâts physique";
			case "damageMultiplierMagical":
				return "Multiplicateur de dégâts magique";
			case "defenseMultiplierPhysical":
				return "Multiplicateur de défense physique";
			case "defenseMultiplierMagical":
				return "Multiplicateur de défense magique";
			case "cooldownReduction":
				return "Réduction de temps de recharge";
			case "criticalChance":
				return "Chance de critique";
			case "criticalDamageMultiplier":
				return "Multiplicateur de dégâts critique";
			default:
				return stat;
		}
	},
};
