export type ShopItem = {
	id: string;
	name: string;
	description: string;
	cost: number;
	effects: ShopItemEffect[];
};

type ShopItemEffect = {
	type: "unlockFeature" | "increaseInventorySize" | "increaseMonsterMaxPerArea";
	value?: number;
	featureId?: string;
	areaId?: string;
};
