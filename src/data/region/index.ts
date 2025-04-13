import type { region } from "../../types/region";

const modules = import.meta.glob("./*.ts", { eager: true });

export const allRegions: Record<string, region> = {};
for (const path in modules) {
	const mod = modules[path] as Record<string, region>;
	const region = Object.values(mod)[0];
	allRegions[region.id] = region;
}
