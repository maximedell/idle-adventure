import { resource } from "../../types/resource";

const modules = import.meta.glob("./*.ts", { eager: true });
export const allResources: Record<string, resource> = {};
for (const path in modules) {
	const mod = modules[path] as Record<string, resource>;
	const resource = Object.values(mod)[0];
	allResources[resource.id] = resource;
}
