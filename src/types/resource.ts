export type Resource = {
	id: string;
	name: string;
	value: number;
	quantity: number;
	rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
	description?: string;
};
