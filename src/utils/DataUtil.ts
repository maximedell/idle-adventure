import { resource } from "../types/resource";
import { skill } from "../types/skill";
import { monster } from "../types/monster";
import { allResources } from "../data/resources";
import { allSkills } from "../data/skills";
import { allMonsters } from "../data/monsters";
import { region } from "../types/region";
import { allRegions } from "../data/region";
import { area } from "../types/area";
import { allAreas } from "../data/areas";

export const DataUtil = {
	/**
	 * Retrieves the resource data for a given resource ID.
	 * @param {string} id - The ID of the resource.
	 * @returns {resource | undefined} - The resource data or undefined if not found.
	 */
	getResourceData(id: string): resource | undefined {
		return allResources[id] || undefined;
	},

	/**
	 * Retrieves the skill data for a given skill ID.
	 * @param {string} id - The ID of the skill.
	 * @returns {skill | undefined} - The skill data or undefined if not found.
	 */
	getSkillData(id: string): skill | undefined {
		return allSkills[id] || undefined;
	},

	/**
	 * Retrieves the monster data for a given monster ID.
	 * @param {string} id - The ID of the monster.
	 * @returns {monster | undefined} - The monster data or undefined if not found.
	 */
	getMonsterData(id: string): monster | undefined {
		return allMonsters[id] || undefined;
	},

	getRegionData(id: string): region | undefined {
		return allRegions[id] || undefined;
	},

	getAreaIdsFromRegionId(id: string): string[] {
		const region = allRegions[id];
		if (!region) return [];
		console.log(region.areas);
		const areaIds = region.areas.map((area) => area.id);
		return areaIds;
	},

	getRegionIdFromAreaId(id: string): string | undefined {
		const area = allAreas[id];
		if (!area) return undefined;
		for (const region of Object.values(allRegions)) {
			if (region.areas.some((areaData) => areaData.id === id)) {
				return region.id;
			}
		}
		return undefined;
	},

	getAreaData(id: string): area | undefined {
		return allAreas[id] || undefined;
	},
};
