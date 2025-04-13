import MinorStrike from "./minor-strike.svg?react";
import Bite from "./bite.svg?react";
import StrikingArrows from "./striking-arrows.svg?react";

export const skillIcons: Record<
	string,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {
	"minor-strike": MinorStrike,
	bite: Bite,
	"striking-arrows": StrikingArrows,
};
