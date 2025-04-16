import { ShopItem } from "../types/shopItem";
import { DataUtil } from "../utils/DataUtil";
export const ShopSystem = {
	getShopItemsVisible(purchasedShopItems: string[], gold: number): ShopItem[] {
		const allShopItems = DataUtil.getAllShopItems();
		const shopItems = allShopItems.filter((item) => {
			const isPurchased = purchasedShopItems.includes(item.id);
			const isAffordable = gold * 1.2 >= item.cost;
			return !isPurchased && isAffordable;
		});
		return shopItems;
	},
};
