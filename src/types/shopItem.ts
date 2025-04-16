export type ShopItem = {
	id: string;
	name: string;
	description: string;
	cost: number;
	effects: ShopItemEffect[];
};

type ShopItemEffect = {
	type: "unlockFeature" | "increaseInventorySize";
	value?: number;
	featureId?: string;
};
