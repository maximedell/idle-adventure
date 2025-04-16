import { MonsterData } from "../types/monster";
import { Skill } from "../types/skill";
import { Resource } from "../types/resource";
import { AreaData } from "../types/area";
import { Region } from "../types/region";
import { Class } from "../types/class";
import { ShopItem } from "../types/shopItem";
import { preload } from "react-dom";

const monsterModules = import.meta.glob("../data/monsters/*.json", {
	import: "default",
}) as Record<string, () => Promise<MonsterData>>;
const monsterCache: Record<string, MonsterData> = {};

const skillModules = import.meta.glob("../data/skills/*.json", {
	import: "default",
}) as Record<string, () => Promise<Skill>>;
const skillCache: Record<string, Skill> = {};

const resourceModules = import.meta.glob("../data/resources/*.json", {
	import: "default",
}) as Record<string, () => Promise<Resource>>;
const resourceCache: Record<string, Resource> = {};

const areaModules = import.meta.glob("../data/areas/*.json", {
	import: "default",
}) as Record<string, () => Promise<AreaData>>;
const areaCache: Record<string, AreaData> = {};

const regionModules = import.meta.glob("../data/regions/*.json", {
	import: "default",
}) as Record<string, () => Promise<Region>>;
const regionCache: Record<string, Region> = {};

const classDataMap: Record<string, Class> = {};

const shopItemDataMap: Record<string, ShopItem> = {};

export const DataUtil = {
	async getMonsterById(id: string): Promise<MonsterData> {
		if (monsterCache[id]) return monsterCache[id];

		const entry = Object.entries(monsterModules).find(([path]) =>
			path.match(new RegExp(`/${id}\\.json$`))
		);
		if (!entry) throw new Error("Monster not found: " + id);

		const loader = entry[1];
		const data = await loader();
		monsterCache[id] = data;
		return data;
	},

	async getSkillById(id: string): Promise<Skill> {
		if (skillCache[id]) return skillCache[id];
		const entry = Object.entries(skillModules).find(([path]) =>
			path.match(new RegExp(`/${id}\\.json$`))
		);
		if (!entry) throw new Error("Skill not found: " + id);
		const loader = entry[1];
		const data = await loader();
		skillCache[id] = data;
		return data;
	},

	async getResourceById(id: string): Promise<Resource> {
		if (resourceCache[id]) return resourceCache[id];
		const entry = Object.entries(resourceModules).find(([path]) =>
			path.match(new RegExp(`/${id}\\.json$`))
		);
		if (!entry) throw new Error("Resource not found: " + id);
		const loader = entry[1];
		const data = await loader();
		resourceCache[id] = data;
		return data;
	},

	async getAreaById(id: string): Promise<AreaData> {
		if (areaCache[id]) return areaCache[id];
		const entry = Object.entries(areaModules).find(([path]) =>
			path.match(new RegExp(`/${id}\\.json$`))
		);
		if (!entry) throw new Error("Area not found: " + id);
		const loader = entry[1];
		const data = await loader();
		areaCache[id] = data;
		return data;
	},

	async getRegionById(id: string): Promise<Region> {
		if (regionCache[id]) return regionCache[id];
		const entry = Object.entries(regionModules).find(([path]) =>
			path.match(new RegExp(`/${id}\\.json$`))
		);
		if (!entry) throw new Error("Region not found: " + id);
		const loader = entry[1];
		const data = await loader();
		regionCache[id] = data;
		return data;
	},

	async preloadAllClasses(): Promise<void> {
		const modules = import.meta.glob("../data/classes/*.json", {
			eager: true,
			import: "default",
		}) as Record<string, Class>;
		for (const [path, data] of Object.entries(modules)) {
			const id = path.split("/").pop()?.split(".")[0] || "";
			classDataMap[id] = data;
		}
	},

	async preloadAllShopItems(): Promise<void> {
		const modules = import.meta.glob("../data/shop/*.json", {
			eager: true,
			import: "default",
		}) as Record<string, ShopItem>;
		for (const [path, data] of Object.entries(modules)) {
			const id = path.split("/").pop()?.split(".")[0] || "";
			shopItemDataMap[id] = data;
		}
	},

	getClassById(id: string): Class {
		return classDataMap[id];
	},

	getAllClasses(): Class[] {
		return Object.values(classDataMap);
	},

	getShopItemById(id: string): ShopItem {
		return shopItemDataMap[id];
	},

	getAllShopItems(): ShopItem[] {
		return Object.values(shopItemDataMap);
	},

	preloadAll() {
		this.preloadAllClasses();
		this.preloadAllShopItems();
	},
};
