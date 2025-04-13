import { boss, monster } from "./monster";

export type area = {
	id: string;
	name: string;
	description?: string;
	size: number;
	monsters: monster[];
	boss?: boss;
	unlockRequirement?: {
		level?: number;
		gold?: number;
	};
};
