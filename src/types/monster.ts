import { CombatStats } from "./stats";

export type MonsterData = {
	id: string;
	name: string;
	description?: string;
	reviveTime: number;
	stats: CombatStats;
	level: number;
	activeSkillIds: string[];
	rewards: {
		experience: number;
		gold: number;
		resourceDrops: ResourceDropData[];
	};
	isBoss: boolean;
	bossRewards?: {
		resourceDrops: ResourceDropData[];
		items?: string[];
	};
};

export type ResourceDropData = {
	resourceId: string;
	amount: number;
	dropRate: number;
};
