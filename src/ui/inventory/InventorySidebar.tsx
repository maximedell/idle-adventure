import {
	useResources,
	useGold,
	useInventorySizeMax,
	useInventorySizeTaken,
} from "../../selectors/InventorySelector";
import { DataUtil } from "../../utils/DataUtil";
import GoldIcon from "../../icons/shared/gold.svg?react";
export default function InventorySidebar() {
	const resources = useResources();
	const gold = useGold();
	const max = useInventorySizeMax();
	const taken = useInventorySizeTaken();

	return (
		<div>
			<h2 className="text-lg font-bold">
				Inventaire ({taken}/{max})
			</h2>
			<h2 className="text-md font-semibold flex items-center">
				<GoldIcon className="fill-current text-primary-light h-6 w-6 mr-2" />{" "}
				{gold}
			</h2>
			<h3 className="text-md font-semibold mt-8">Resources:</h3>
			{/* Use a list to display resources */}
			<ul className="pl-5 l">
				{Object.entries(resources).map(([key, value]) => (
					<li key={key} className="text-sm">
						{DataUtil.getResourceData(key)?.name}: {value}
					</li>
				))}
			</ul>
		</div>
	);
}
