import { useEffect, useState } from "react";
import { DataUtil } from "../utils/DataUtil";
import { Region } from "../types/region";

export function useUnlockedRegions(
	unlockedRegionIds: Record<string, string[]>
): Region[] {
	const [regions, setRegions] = useState<Region[]>([]);
	useEffect(() => {
		const fetchRegions = async () => {
			const loaded = await Promise.all(
				Object.keys(unlockedRegionIds).map((id) => DataUtil.getRegionById(id))
			);
			setRegions(loaded.filter(Boolean) as Region[]);
		};
		fetchRegions();
	}, [unlockedRegionIds]);
	return regions;
}
