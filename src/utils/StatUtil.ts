import { JSX } from "react";
import {
	BASE_STAT_DEPENDENT_STAT_KEYS,
	BASE_STAT_KEYS,
	INTELLIGENCE_DEPENDENT_STAT_KEYS,
	DEXTERITY_DEPENDENT_STAT_KEYS,
	STRENGTH_DEPENDENT_STAT_KEYS,
	LEVEL_DEPENDENT_STAT_KEYS,
	PER_LEVEL_CONSTANTS,
	PER_STAT_DEPENDENT_CONSTANTS,
	GENERAL_STAT_KEYS,
	BASE_STATS_CONSTANTS,
} from "../data/constant";
import { useAdventurerStore } from "../stores/AdventurerStore";
import {
	BaseStatDependentStatKeys,
	BaseStatKeys,
	CombatStats,
	LevelDependentStatKeys,
} from "../types/stats";
import { ClassUtil } from "./ClassUtil";
import { MathUtil } from "./MathUtil";

export const StatUtil = {
	getStatName(stat: keyof CombatStats): string {
		switch (stat) {
			case "level":
				return "Niveau";
			case "strength":
				return "Force";
			case "dexterity":
				return "Dextérité";
			case "intelligence":
				return "Intelligence";
			case "maxHealth":
				return "Points de vie";
			case "maxMana":
				return "Mana";
			case "manaRegen":
				return "Régénération de mana";
			case "armor":
				return "Armure";
			case "magicResist":
				return "Résistance magique";
			case "damageMultiplierPhysical":
				return "Augmentation de dégâts physique";
			case "damageMultiplierMagical":
				return "Augmentation de dégâts magique";
			case "defenseMultiplierPhysical":
				return "Réduction de dégâts physique";
			case "defenseMultiplierMagical":
				return "Réduction de dégâts magique";
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
	getStatValueText(
		stat: keyof CombatStats,
		value: number,
		decimalPlaces: number = 2
	): string {
		switch (stat) {
			case "level":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "strength":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "dexterity":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "intelligence":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "maxHealth":
				return `${MathUtil.floorTo(value, decimalPlaces)} PV`;
			case "maxMana":
				return `${MathUtil.floorTo(value, decimalPlaces)} MP`;
			case "manaRegen":
				return `${MathUtil.floorTo(value, decimalPlaces)} MP/s`;
			case "armor":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "magicResist":
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
			case "damageMultiplierPhysical":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			case "damageMultiplierMagical":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			case "defenseMultiplierPhysical":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			case "defenseMultiplierMagical":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			case "cooldownReduction":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			case "criticalChance":
				return `${Math.floor(MathUtil.floorTo(value, decimalPlaces) * 100)}%`;
			case "criticalDamageMultiplier":
				return `${Math.floor(
					MathUtil.floorTo(value - 1, decimalPlaces) * 100
				)}%`;
			default:
				return `${MathUtil.floorTo(value, decimalPlaces)}`;
		}
	},
	calculateCombatStats(
		level: number = useAdventurerStore.getState().level
	): CombatStats {
		const stats: Partial<CombatStats> = { level: level };
		const state = useAdventurerStore.getState();
		const classIds = state.classIds;
		for (const key of LEVEL_DEPENDENT_STAT_KEYS) {
			let multiplier = PER_LEVEL_CONSTANTS[key];
			let statValue = BASE_STATS_CONSTANTS[key];
			// Add the amount increased per level
			multiplier += this.calculatePerLevelDependentStatsFromClasses(
				key,
				classIds
			);

			// Multiply by the level
			statValue += multiplier * (level - 1);

			// Add value from different sources
			if (BASE_STAT_KEYS.includes(key as BaseStatKeys)) {
				statValue += state[key as BaseStatKeys];
			}
			statValue += this.calculateStatFromClasses(key, classIds);
			// TODO: Add value from items, passive, etc.

			// Set the value in the stats object
			stats[key] = statValue;
		}
		const dependencyMap: readonly [
			readonly BaseStatDependentStatKeys[],
			BaseStatKeys
		][] = [
			[STRENGTH_DEPENDENT_STAT_KEYS, "strength"],
			[DEXTERITY_DEPENDENT_STAT_KEYS, "dexterity"],
			[INTELLIGENCE_DEPENDENT_STAT_KEYS, "intelligence"],
		];

		for (const key of BASE_STAT_DEPENDENT_STAT_KEYS) {
			let multiplier = PER_STAT_DEPENDENT_CONSTANTS[key];
			let statValue = BASE_STATS_CONSTANTS[key];
			for (const [dependentKeys, baseStatKey] of dependencyMap) {
				if (dependentKeys.includes(key as BaseStatDependentStatKeys)) {
					// Add the amount increased per level
					multiplier += this.calculatePerStatDependentStatsFromClasses(
						key,
						baseStatKey,
						classIds
					);
					// Multiply by the Base Stat
					statValue += multiplier * stats[baseStatKey]!;
					break;
				}
			}

			// Add value from different sources
			statValue += this.calculateStatFromClasses(key, classIds);
			// TODO: Add value from items, passive, etc.

			// Set the value in the stats object
			stats[key] = statValue;
		}

		for (const key of GENERAL_STAT_KEYS) {
			let statValue = 0;

			// Add value from different sources
			statValue += this.calculateStatFromClasses(key, classIds);
			// TODO: Add value from items, passive, etc.

			// Set the value in the stats object
			stats[key] = Math.max(0, statValue);
		}
		return stats as CombatStats;
	},
	calculatePerLevelDependentStatsFromClasses(
		key: LevelDependentStatKeys,
		classIds: string[] = useAdventurerStore.getState().classIds
	): number {
		let statValue = 0;
		for (const classId of classIds) {
			statValue += ClassUtil.getPerLevelDependentStatsFromClassId(key, classId);
		}
		return statValue;
	},

	calculateStatFromClasses(
		key: keyof CombatStats,
		classIds: string[] = useAdventurerStore.getState().classIds
	): number {
		let statValue = 0;
		for (const classId of classIds) {
			statValue += ClassUtil.getStatFromClassId(key, classId);
		}
		return statValue;
	},

	calculatePerStatDependentStatsFromClasses(
		statDependentKey: BaseStatDependentStatKeys,
		baseStatKey: BaseStatKeys,
		classIds: string[] = useAdventurerStore.getState().classIds
	): number {
		let statValue = 0;
		for (const classId of classIds) {
			statValue += ClassUtil.getPerStatDependentStatFromClassId(
				baseStatKey,
				statDependentKey,
				classId
			);
		}
		return statValue;
	},

	calculateMonsterCombatStats(monsterStats: CombatStats): CombatStats {
		const stats: Partial<CombatStats> = { level: monsterStats.level };
		for (const key of LEVEL_DEPENDENT_STAT_KEYS) {
			stats[key] = monsterStats[key];
		}
		const dependencyMap: readonly [
			readonly BaseStatDependentStatKeys[],
			BaseStatKeys
		][] = [
			[STRENGTH_DEPENDENT_STAT_KEYS, "strength"],
			[DEXTERITY_DEPENDENT_STAT_KEYS, "dexterity"],
			[INTELLIGENCE_DEPENDENT_STAT_KEYS, "intelligence"],
		];
		for (const key of BASE_STAT_DEPENDENT_STAT_KEYS) {
			for (const [dependentKeys, baseStatKey] of dependencyMap) {
				if (dependentKeys.includes(key as BaseStatDependentStatKeys)) {
					const multiplier = PER_STAT_DEPENDENT_CONSTANTS[key];
					// Multiply by the Base Stat and Adding the base stat value
					stats[key] =
						monsterStats[baseStatKey]! * multiplier + monsterStats[key]!;
					break;
				}
			}
		}
		for (const key of GENERAL_STAT_KEYS) {
			stats[key] = monsterStats[key]!;
		}
		return stats as CombatStats;
	},
};
