import {
	useResources,
	useGold,
	useInventorySizeMax,
	useInventorySizeTaken,
} from "../../selectors/InventorySelector";
import { DataUtil } from "../../utils/DataUtil";
import GoldIcon from "../../icons/shared/gold.svg?react";
import { Resource } from "../../types/resource";
import { useEffect, useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";
import SellIcon from "../../icons/shared/sell.svg?react";
import { useInventoryStore } from "../../stores/InventoryStore";
export default function InventorySidebar() {
	const [resources, setResources] = useState<Record<string, Resource>>({});
	const [isLoading, setIsLoading] = useState(true);
	const resourceRecords: Record<string, number> = useResources();
	const gold = useGold();
	const max = useInventorySizeMax();
	const taken = useInventorySizeTaken();

	useEffect(() => {
		const fetchResources = async () => {
			const resourceData: Record<string, Resource> = {};
			for (const resourceId in resourceRecords) {
				const resource = await DataUtil.getResourceById(resourceId);
				resourceData[resourceId] = resource;
			}
			setResources(resourceData);
		};
		fetchResources();
		setIsLoading(false);
	}, [resourceRecords]);

	const handleClick = (resourceId: string, value: number) => {
		useInventoryStore.getState().sellResource(resourceId, value);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}
	return (
		<div>
			<h2 className="text-lg font-bold">
				Inventaire ({taken}/{max})
			</h2>
			<h2 className="text-md font-semibold flex items-center mt-4">
				<GoldIcon className="fill-current text-primary-light h-6 w-6 mr-2" />{" "}
				{gold}
			</h2>
			<h3 className="text-md font-semibold mt-4">Resources:</h3>
			{/* Use a list to display resources */}
			<ul className="pl-5 l">
				{Object.entries(resourceRecords).map(([key, amount]) => (
					<li key={key} className="text-sm flex flex-row justify-between">
						<p className="flex w-fit">
							{resources[key]?.name}: {amount}
						</p>
						<button
							className="flex flex-row"
							onClick={() => handleClick(key, amount * resources[key]?.value)}
						>
							<SellIcon className="w-4 h-4 fill-current text-primary-light" />
							{resources[key]?.value * amount}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
