import { Monster } from "../modules/monster/Monster";
import { useGameStore } from "../store/GameStore";
import { skill } from "../types/skill";

export function startCombat(delta: number) {
	handleCombatTick(delta);
}

function handleCombatTick(delta: number) {
	const state = useGameStore.getState();
	const player = state.adventurer;
	const area = state.activeArea;
	if (!player || !area) return;
	const enemies = area.getMonsters();
	const log: string[] = [];

	// Appliquer les compétences dans l'ordre de priorité
	const skill = player.getAvailableSkill();

	if (skill) {
		player.applySkill(skill);
		const { dmg, targets } = computeSkillDamage(skill, enemies);

		for (const target of targets) {
			target.applyDamage(dmg);
		}

		log.push(
			`L'aventurier utilise ${skill.name} et inflige ${dmg} dégâts à ${targets
				.map((t) => t.getName())
				.join(", ")}`
		);
	}

	// Nettoyer les ennemis morts
	const aliveEnemies = enemies.filter((e) => e.isAlive());

	// Gérer fin de combat
	if (aliveEnemies.length === 0) {
		endCombatWithVictory();
	} else {
		for (const enemy of aliveEnemies) {
			const enemySkill = enemy.getAvailableSkill();
			const target = player;
			if (enemySkill && target.isAlive()) {
				enemy.applySkill(enemySkill);
				const dmg = computeEnemyDamage(enemySkill);
				target.applyDamage(dmg);
				log.push(
					`${enemy.getName()} utilise ${
						enemySkill.name
					} et inflige ${dmg} dégâts`
				);
			}
			if (!target.isAlive()) {
				handlePlayerDeath();
				break;
			}
		}
	}
}

function computeEnemyDamage(skill: skill): number {
	let dmg = 0;
	for (const effect of skill.effects) {
		if (effect.type === "damage") {
			dmg += effect.value;
		}
	}
	return dmg;
}

function computeSkillDamage(
	skill: skill,
	ennemies: Monster[]
): { dmg: number; targets: Monster[] } {
	let dmg = 0;
	let target = 0;
	for (const effect of skill.effects) {
		if (effect.type === "damage") {
			dmg += effect.value;
			target = effect.target;
		}
	}
	const targets = ennemies.slice(0, Math.min(target, ennemies.length));

	return { dmg, targets };
}

function endCombatWithVictory() {
	return;
	// Gérer les gains (xp, ressources...) ici
}

function handlePlayerDeath() {
	return;
	// Passage en écran de mort / déclenche prestige
}
