import { area } from "./area";

export type region = {
	id: string;
	name: string;
	description?: string;
	areas: area[];
};
