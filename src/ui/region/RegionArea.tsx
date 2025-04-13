import { useUnlockedAreas } from "../../selectors/GameSelector";
import { DataUtil } from "../../utils/DataUtil";
import TooltipWrapper from "../shared/TooltipWrapper";
import AreaTooltip from "./AreaTooltip";
import { useState, useEffect } from "react";
import { AreaData } from "../../types/area";
import LoadingSpinner from "../shared/LoadingSpinner";

interface RegionAreaProps {
	areaId: string;
	className?: string;
	regionId: string;
}
export default function RegionArea({
	areaId,
	className,
	regionId,
}: RegionAreaProps) {
	const [area, setArea] = useState<AreaData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const unlockedAreas = useUnlockedAreas(regionId);
	const isUnlocked = unlockedAreas[regionId]?.includes(areaId);

	useEffect(() => {
		const fetchAreaData = async () => {
			const areaData = await DataUtil.getAreaById(areaId);
			setArea(areaData);
		};
		fetchAreaData();
		setIsLoading(false);
	}, [areaId]);
	if (isLoading || !area) {
		return <LoadingSpinner />;
	}
	if (isUnlocked) {
		return (
			<TooltipWrapper
				tooltipContent={
					<AreaTooltip areaId={areaId} className="" isLocked={false} />
				}
			>
				<div className={`${className} pl-2 p-1 border-b border-primary`}>
					<p>{area.name}</p>
				</div>
			</TooltipWrapper>
		);
	} else {
		return (
			<div className={`${className} pl-2 p-1  border-b border-primary`}>
				<p>Requis:</p>
				<p>
					{area && area.unlockRequirement?.gold
						? `Or: ${area.unlockRequirement.gold}`
						: ""}
				</p>
				<p>
					{area && area.unlockRequirement?.level
						? `Niveau: ${area.unlockRequirement.level}`
						: ""}
				</p>
			</div>
		);
	}
}
