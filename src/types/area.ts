export type AreaData = {
	id: string;
	name: string;
	description?: string;
	size: number;
	monsterIds: string[];
	isBossArea?: boolean;
	unlockRequirement?: {
		level?: number;
		gold?: number;
	};
};
