import type { monster } from "../../types/monster";

const modules = import.meta.glob("./*.ts", { eager: true });

export const allMonsters: Record<string, monster> = {};

for (const path in modules) {
	const mod = modules[path] as Record<string, monster>;
	const skill = Object.values(mod)[0];
	allMonsters[skill.id] = skill;
}
