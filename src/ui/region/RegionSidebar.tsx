import {
	useActiveArea,
	useUnlockedRegionIds,
} from "../../selectors/GameSelector";
import { useUnlockedRegions } from "../../hooks/useUnlockedRegions";
import DevelopIcon from "../../icons/shared/develop.svg?react";
import RegionArea from "./RegionArea";
import { useEffect, useState } from "react";
export default function RegionSidebar() {
	const unlockedRegions = useUnlockedRegionIds();
	const regions = useUnlockedRegions(unlockedRegions);
	const [developedRegions, setDevelopedRegions] = useState<
		Record<string, boolean>
	>({});
	const activeAreaId = useActiveArea()?.getId();

	useEffect(() => {
		const initialDevelopedRegions = regions.reduce((acc, region) => {
			acc[region.id] = false;
			return acc;
		}, {} as Record<string, boolean>);
		setDevelopedRegions(initialDevelopedRegions);
	}, [regions]);
	if (!activeAreaId) return null;
	if (!unlockedRegions) return null;

	return (
		<div>
			<h2 className="text-lg font-bold text-center">Regions</h2>
			<ul className="p-0">
				{regions.map((region) => (
					<li
						key={region.id}
						className="cursor-pointer select-none"
						onClick={() =>
							setDevelopedRegions((prev) => ({
								...prev,
								[region.id]: !prev[region.id],
							}))
						}
					>
						<div className="text-sm w-full bg-primary-light text-black p-1 px-2 flex justify-between items-center">
							<h3 className="text-black">{region.name}</h3>
							<DevelopIcon
								className={`w-4 h-4 fill-current ${
									developedRegions[region.id] ? "rotate-180" : ""
								}`}
							/>
						</div>
						{developedRegions[region.id] && (
							<ul className={`flex flex-col p-0`}>
								{region.areaIds?.length > 0 &&
									region.areaIds.map((areaId) => (
										<li
											key={areaId}
											className={`flex flex-col w-full hover:bg-primary hover:text-black ${
												activeAreaId === areaId
													? "bg-primary text-primary-light font-bold"
													: ""
											}`}
											onClick={(e) => e.stopPropagation()}
										>
											<RegionArea
												areaId={areaId}
												regionId={region.id}
												key={areaId}
												className=""
											/>
										</li>
									))}
							</ul>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
