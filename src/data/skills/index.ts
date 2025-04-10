import type { skill } from "../../types/skill";

const modules = import.meta.glob("./*.ts", { eager: true });

export const allSkills: Record<string, skill> = {};

for (const path in modules) {
	const mod = modules[path] as Record<string, skill>;
	const skill = Object.values(mod)[0];
	allSkills[skill.id] = skill;
}
