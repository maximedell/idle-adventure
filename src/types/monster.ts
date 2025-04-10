import { stats } from "./stats";
import { skill } from "./skill";

export type monster = {
	id: string;
	name: string;
	description?: string;

	stats: stats;
	activeSkills: skill[];

	rewards: monsterRewards;
	isBoss: boolean;
};

export type monsterRewards = {
	experience: number;
	gold: number;
	resources: resourceDrop[]; // pour plus tard : composants de craft
};

export type resourceDrop = {
	resourceId: string;
	amount: number;
};
