import { usePurchasedShopItems } from "../../selectors/GameSelector";
import { useGold } from "../../selectors/InventorySelector";
import { ShopSystem } from "../../systems/ShopSystem";

export default function Shop() {
	const purchasedShopItems = usePurchasedShopItems();
	const gold = useGold();
	const visibleShopItems = ShopSystem.getItemsVisible(purchasedShopItems);
	return (
		<div className="box-content">
			<h1 className="text-2xl font-bold mb-4">Boutique</h1>
			<ul className="space-y-2">
				{visibleShopItems.map((item) => {
					const isAffordable = gold >= item.cost;
					return (
						<li
							key={item.id}
							className="flex items-center justify-between p-2 border-b border-primary"
						>
							<div className="flex flex-col relative w-full">
								<span className="name">{item.name}</span>
								<span className="description">{item.description}</span>
								<button
									className={`${
										isAffordable ? "btn" : "btn-disabled"
									} absolute right-0 top-0 bottom-0 h-fit m-auto`}
									disabled={!isAffordable}
									onClick={() => ShopSystem.purchaseItem(item)}
								>
									Buy for {item.cost} gold
								</button>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
