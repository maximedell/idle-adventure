import {
	useResources,
	useGold,
	useInventorySizeMax,
	useInventorySizeTaken,
} from "../../selectors/InventorySelector";
import { DataUtil } from "../../utils/DataUtil";
import GoldIcon from "../../icons/shared/gold.svg?react";
import { Resource } from "../../types/resource";
import { use, useEffect, useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";
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
				{Object.entries(resourceRecords).map(([key, value]) => (
					<li key={key} className="text-sm">
						{resources[key]?.name}: {value}
					</li>
				))}
			</ul>
		</div>
	);
}
