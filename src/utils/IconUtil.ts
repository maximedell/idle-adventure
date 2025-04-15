const skillIcons = import.meta.glob("../icons/skills/*.svg", {
	query: "?react",
	import: "default",
}) as Record<string, () => Promise<React.FC<React.SVGProps<SVGSVGElement>>>>;
const skillIconsCache: Record<
	string,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {};

const monsterIcons = import.meta.glob("../icons/monsters/*.svg", {
	query: "?react",
	import: "default",
}) as Record<string, () => Promise<React.FC<React.SVGProps<SVGSVGElement>>>>;
const monsterIconsCache: Record<
	string,
	React.FC<React.SVGProps<SVGSVGElement>>
> = {};

export const IconUtil = {
	async getSkillIcon(
		id: string
	): Promise<React.FC<React.SVGProps<SVGSVGElement>>> {
		if (skillIconsCache[id]) return skillIconsCache[id];

		const entry = Object.entries(skillIcons).find(([path]) =>
			path.match(new RegExp(`/${id}\\.svg$`))
		);
		if (!entry) throw new Error("Skill icon not found: " + id);
		const loader = entry[1];
		const icon = await loader();
		skillIconsCache[id] = icon;
		return icon;
	},

	async getMonsterIcon(
		id: string
	): Promise<React.FC<React.SVGProps<SVGSVGElement>>> {
		if (monsterIconsCache[id]) return monsterIconsCache[id];

		const entry = Object.entries(monsterIcons).find(([path]) =>
			path.match(new RegExp(`/${id}\\.svg$`))
		);
		if (!entry) throw new Error("Monster icon not found: " + id);
		const loader = entry[1];
		const icon = await loader();
		monsterIconsCache[id] = icon;
		return icon;
	},
};
