import { stats, monsterStats } from "./stats";
import { skill } from "./skill";
import { resource } from "./resource";
import { area } from "./area";

export type monster = {
	id: string;
	name: string;
	description?: string;

	reviveTime: number; // en secondes

	stats: monsterStats;
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

export type boss = monster & {
	isBoss: true;
	isDefeated: boolean;
	bossRewards: bossRewards;
};

export type bossRewards = {
	unlocksRegion?: string;
	unlocksArea?: area;
	specialItem?: string;
};
