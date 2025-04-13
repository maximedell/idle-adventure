import {
	useActiveAreaId,
	useUnlockedRegions,
} from "../../selectors/GameSelector";
import { DataUtil } from "../../utils/DataUtil";
import DevelopIcon from "../../icons/shared/develop.svg?react";
import RegionArea from "./RegionArea";
import { useEffect, useState } from "react";
export default function RegionSidebar() {
	const regions = useUnlockedRegions();
	const [developedRegions, setDevelopedRegions] = useState<
		Record<string, boolean>
	>({});
	const activeAreaId = useActiveAreaId();
	useEffect(() => {
		const initialDevelopedRegions = Object.keys(regions).reduce(
			(acc, regionId) => {
				acc[regionId] = false;
				return acc;
			},
			{} as Record<string, boolean>
		);
		setDevelopedRegions(initialDevelopedRegions);
	}, [regions]);

	return (
		<div>
			<h2 className="text-lg font-bold text-center">Regions</h2>
			<ul className="p-0">
				{Object.entries(regions).map(([regionId]) => (
					<li
						key={regionId}
						className="cursor-pointer select-none"
						onClick={() =>
							setDevelopedRegions((prev) => ({
								...prev,
								[regionId]: !prev[regionId],
							}))
						}
					>
						<div className="text-sm w-full bg-primary-light text-black p-1 px-2 flex justify-between items-center">
							<h2 className="text-black">
								{DataUtil.getRegionData(regionId)?.name}
							</h2>
							<DevelopIcon
								className={`w-4 h-4 fill-current ${
									developedRegions[regionId] ? "rotate-180" : ""
								}`}
							/>
						</div>
						{developedRegions[regionId] && (
							<ul className={`flex flex-col p-0`}>
								{DataUtil.getAreaIdsFromRegionId(regionId)?.length > 0 &&
									DataUtil.getAreaIdsFromRegionId(regionId).map((areaId) => (
										<li
											key={areaId}
											className={`flex flex-col w-full hover:bg-primary hover:text-black ${
												activeAreaId === areaId
													? "bg-primary text-primary-light font-bold"
													: ""
											}`}
										>
											<RegionArea areaId={areaId} key={areaId} className="" />
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
