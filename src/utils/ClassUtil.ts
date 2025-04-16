import { Class } from "../types/class";
import { DataUtil } from "./DataUtil";
import {
	BaseStatDependentStatKeys,
	BaseStatKeys,
	CombatStats,
	LevelDependentStatKeys,
} from "../types/stats";
import { useAdventurerUnlockedTalents } from "../selectors/AdventurerSelector";

export const ClassUtil = {
	getClassById(classId: string): Class {
		return DataUtil.getClassById(classId);
	},

	getStatFromClassId(stat: keyof CombatStats, classId: string): number {
		const classData = this.getClassById(classId);
		const unlockedTalents = useAdventurerUnlockedTalents();
		let statValue = 0;
		for (const talent of classData.talents) {
			if (unlockedTalents.includes(talent.id)) {
				for (const effect of talent.talentEffects) {
					if (effect.stat === stat && effect.type === "stat") {
						statValue += effect.value || 0;
					}
				}
			}
		}
		return statValue;
	},

	getPerLevelDependentStatsFromClassId(
		stat: LevelDependentStatKeys,
		classId: string
	): number {
		const classData = this.getClassById(classId);
		const unlockedTalents = useAdventurerUnlockedTalents();
		let statValue = 0;
		for (const talent of classData.talents) {
			if (unlockedTalents.includes(talent.id)) {
				for (const effect of talent.talentEffects) {
					if (effect.stat === stat && effect.type === "onLevelUp") {
						statValue += effect.value || 0;
					}
				}
			}
		}
		return statValue;
	},

	getPerStatDependentStatFromClassId(
		baseStat: BaseStatKeys,
		combatStat: BaseStatDependentStatKeys,
		classId: string
	): number {
		const classData = this.getClassById(classId);
		const unlockedTalents = useAdventurerUnlockedTalents();
		let statValue = 0;
		for (const talent of classData.talents) {
			if (unlockedTalents.includes(talent.id)) {
				for (const effect of talent.talentEffects) {
					if (
						effect.baseStat === baseStat &&
						effect.stat === combatStat &&
						effect.type === "combatStatPerBaseStat"
					) {
						statValue += effect.value || 0;
					}
				}
			}
		}
		return statValue;
	},
};
