import type { area } from "../../types/area";

const modules = import.meta.glob("./*.ts", { eager: true });

export const allAreas: Record<string, area> = {};
for (const path in modules) {
	const mod = modules[path] as Record<string, area>;
	const area = Object.values(mod)[0];
	allAreas[area.id] = area;
}
