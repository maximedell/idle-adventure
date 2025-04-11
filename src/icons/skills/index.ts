import MinorStrike from "./minor-strike.svg?react";
import RatBite from "./rat-bite.svg?react";
import StrikingArrows from "./striking-arrows.svg?react";

export const skillIcons: Record<
	string,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {
	"minor-strike": MinorStrike,
	"rat-bite": RatBite,
	"striking-arrows": StrikingArrows,
};
