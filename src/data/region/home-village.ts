import type { region } from "../../types/region";
import { allAreas } from "../areas";

export const homeVillage: region = {
	id: "home-village",
	name: "Village natal",
	description:
		"Le village où vous avez grandi. Il est paisible et tranquille, mais il y a des rumeurs de monstres dans les environs.",
	areas: [
		allAreas["village-alleys"],
		allAreas["village-outskirts"],
		allAreas["village-wood"],
		allAreas["village-cavern"],
		allAreas["village-cavern-boss"],
	],
};
