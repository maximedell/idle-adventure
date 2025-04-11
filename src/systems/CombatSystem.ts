import { Adventurer } from "../modules/Adventurer";
import { Monster } from "../modules/Monster";
import { useGameStore } from "../stores/GameStore";
import { useMonsterStore } from "../stores/MonsterStore";
import { skill } from "../types/skill";
import { RewardSystem } from "./RewardSystem";

export function startCombat() {
	handleCombatTick();
}

function handleCombatTick() {
	const state = useGameStore.getState();
	const player = state.adventurer;
	const area = state.activeArea;
	if (!player || !area) return;
	const enemies = area.getMonsters();
	const alive = enemies.filter((e) => e.isAlive());
	if (!player.isAlive() || !player.getActiveSkills().length) {
		return;
	}
	if (alive.length === 0) return;
	if (
		alive.length === enemies.length &&
		useMonsterStore.getState().respawnMonsters
	) {
		useMonsterStore.getState().setRespawnMonsters(false);
	}

	// Appliquer les compétences dans l'ordre de priorité
	const skill = player.getAvailableSkill();

	if (skill) {
		player.applySkill(skill);
		const { dmg, targets } = computeSkillDamage(skill, alive);

		for (const target of targets) {
			target.applyDamage(dmg);
		}
		state.addBattleLog(
			`L'aventurier utilise ${skill.name} et inflige ${dmg} dégâts à ${targets
				.map((t) => t.getName())
				.join(", ")}`,
			"default"
		);
		for (const target of targets) {
			if (!target.isAlive()) RewardSystem.applyRewardExperience(player, target);
		}
	}

	// Nettoyer les ennemis morts
	const aliveEnemies = enemies.filter((e) => e.isAlive());

	// Gérer fin de combat
	if (aliveEnemies.length === 0) {
		endCombatWithVictory(player, enemies);
	} else {
		for (const enemy of aliveEnemies) {
			const enemySkill = enemy.getAvailableSkill();
			const target = player;
			if (enemySkill && target.isAlive()) {
				enemy.applySkill(enemySkill);
				const dmg = computeEnemyDamage(enemySkill);
				target.applyDamage(dmg);
				state.addBattleLog(
					`${enemy.getName()} utilise ${
						enemySkill.name
					} et inflige ${dmg} dégâts`,
					"warning"
				);
			}
			if (!target.isAlive()) {
				handlePlayerDeath();
				return;
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

function endCombatWithVictory(adventurer: Adventurer, enemies: Monster[]) {
	useGameStore
		.getState()
		.addBattleLog("L'aventurier a vaincu tous les ennemis !", "success");
	useMonsterStore.getState().setRespawnMonsters(true);
	RewardSystem.applyRewardDrops(adventurer, enemies);
	return;
	// Gérer les gains (xp, ressources...) ici
}

function handlePlayerDeath() {
	const state = useGameStore.getState();
	state.addBattleLog("L'aventurier est mort !", "danger");
	state.setBattleState("idle");
	return;
	// Passage en écran de mort / déclenche prestige
}
