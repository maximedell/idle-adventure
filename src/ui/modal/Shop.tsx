import { usePurchasedShopItems } from "../../selectors/GameSelector";
import { useGold } from "../../selectors/InventorySelector";
import { ShopSystem } from "../../systems/ShopSystem";

export default function Shop() {
	const purchasedShopItems = usePurchasedShopItems();
	const gold = useGold();
	const visibleShopItems = ShopSystem.getShopItemsVisible(
		purchasedShopItems,
		gold
	);
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold mb-4">Shop</h1>
			<p className="text-gray-700">Welcome to the shop!</p>
		</div>
	);
}
