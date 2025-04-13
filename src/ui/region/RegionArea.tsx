import { useUnlockedAreas } from "../../selectors/GameSelector";
import { DataUtil } from "../../utils/DataUtil";
import TooltipWrapper from "../shared/TooltipWrapper";
import AreaTooltip from "./AreaTooltip";

interface RegionAreaProps {
	areaId: string;
	className?: string;
}
export default function RegionArea({ areaId, className }: RegionAreaProps) {
	const name = DataUtil.getAreaData(areaId)?.name;
	const regionId = DataUtil.getRegionIdFromAreaId(areaId);
	if (!regionId) return null;
	const unlockedAreas = useUnlockedAreas(regionId);
	const isUnlocked = unlockedAreas[regionId]?.includes(areaId);
	const area = DataUtil.getAreaData(areaId);
	if (isUnlocked) {
		return (
			<TooltipWrapper
				tooltipContent={
					<AreaTooltip areaId={areaId} className="" isLocked={false} />
				}
			>
				<div className={`${className} pl-2 p-1 border-b border-primary`}>
					<p>{name}</p>
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
