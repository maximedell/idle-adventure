import { adventurerClass } from "./avdventurerClass";
import { skill } from "./skill";
import { stats } from "./stats";

export type adventurer = {
	stats: stats;
	gold: number;
	talentPoints: number;
	destinyPoints: number;
	class?: adventurerClass;
	activeSkills: skill[];
	unlockedTalentIds: string[];
};
