import { useGameStore } from "../stores/GameStore";
import { useInventoryStore } from "../stores/InventoryStore";
import { useAreaStore } from "../stores/AreaStore";
import { ShopItem } from "../types/shopItem";
import { DataUtil } from "../utils/DataUtil";
export const ShopSystem = {
	getItemsVisible(purchasedShopItems: string[]): ShopItem[] {
		const allShopItems = DataUtil.getAllShopItems().sort(
			(a, b) => a.cost - b.cost
		);
		const shopItems = allShopItems.filter((item) => {
			const isPurchased = purchasedShopItems.includes(item.id);
			const isAffordable =
				useInventoryStore.getState().maxGold >= Math.floor(item.cost / 5);
			return !isPurchased && isAffordable;
		});
		if (shopItems.length === 0) {
			const item = allShopItems[0];
			return [item];
		} else {
			const lastItem = shopItems[shopItems.length - 1];
			const lastIndex = allShopItems.indexOf(lastItem);
			const nextItem = allShopItems[lastIndex + 1];
			if (nextItem) {
				shopItems.push(nextItem);
			}
		}
		return shopItems;
	},

	purchaseItem(item: ShopItem) {
		const gameState = useGameStore.getState();
		const inventoryState = useInventoryStore.getState();
		const purchasedShopItems = gameState.purchasedShopItems;
		if (
			!purchasedShopItems.includes(item.id) &&
			inventoryState.gold >= item.cost
		) {
			purchasedShopItems.push(item.id);
			this.applyShopItemEffect(item);
			gameState.addPurchasedShopItem(item.id);
			inventoryState.removeGold(item.cost);
		}
	},

	applyShopItemEffect(item: ShopItem) {
		for (const effect of item.effects) {
			switch (effect.type) {
				case "unlockFeature":
					useGameStore
						.getState()
						.unlockFeatureFromShop(effect.featureId as string);
					break;
				case "increaseInventorySize":
					useInventoryStore.getState().increaseSize(effect.value as number);
					break;
				case "increaseMonsterMaxPerArea":
					useAreaStore
						.getState()
						.increaseMonsterMaxPerArea(
							effect.areaId as string,
							effect.value as number
						);
					break;
				default:
					throw new Error(`Unknown effect type: ${effect.type}`);
			}
		}
	},
};
