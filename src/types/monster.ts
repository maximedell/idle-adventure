import { stats } from "./stats";
import { skill } from "./skill";
import { resource } from "./resource";

export type monster = {
	id: string;
	name: string;
	description?: string;

	reviveTime: number; // en secondes

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
	resource: resource;
	dropRate: number; // 0-100
};
