import { Monster } from "../modules/Monster";
import { useGameStore } from "../stores/GameStore";
import { useMonsterStore } from "../stores/MonsterStore";
import { RewardSystem } from "./RewardSystem";
import { SkillUtil } from "../utils/SkillUtil";
import { CombatStats } from "../types/stats";

export function startCombat() {
	handleCombatTick();
}

function handleCombatTick() {
	const state = useGameStore.getState();
	const player = state.adventurer;
	const area = state.area;
	if (!player || !area) return;
	const playerCombatStats = player.getCombatStats();
	if (!playerCombatStats) throw new Error("Player has no combat stats");
	const enemies = area.getMonsters();
	const alive = enemies.filter((e) => e.isAlive());
	const skill = player.getAvailableSkill();
	const monstersAreRespawning = useMonsterStore.getState().respawnMonsters;

	if (!player.isAlive() || !skill) {
		return;
	}
	if (alive.length === 0) return;
	if (alive.length === enemies.length && monstersAreRespawning) {
		useMonsterStore.getState().setRespawnMonsters(false);
	}
	if (useMonsterStore.getState().respawnMonsters) return;

	// Appliquer les compétences dans l'ordre de priorité
	if (!state.inCombat) state.setInCombat(true);

	player.applySkill(skill);

	for (const effect of skill.effects) {
		if (effect.type === "damage") {
			const targets = alive.slice(0, effect.target);
			const critMultiplier = getActualCritMultiplier(playerCombatStats);
			for (const target of targets) {
				const dmg = SkillUtil.getEffectiveDamageToTarget(
					effect,
					playerCombatStats,
					target.getCombatStats(),
					critMultiplier
				);
				target.applyDamage(dmg);
				state.addBattleLog(
					`L'aventurier utilise ${
						skill.name
					} et inflige ${dmg} dégâts à ${target.getName()}. ${
						critMultiplier > 1 ? "Coup Critique!" : ""
					}`,
					"default"
				);
				if (!target.isAlive()) {
					RewardSystem.applyRewardExperience(player, target);
				}
			}
		}
	}

	// Nettoyer les ennemis morts
	const aliveEnemies = enemies.filter((e) => e.isAlive());

	// Gérer fin de combat
	if (aliveEnemies.length === 0) {
		endCombatWithVictory(enemies);
	} else {
		for (const enemy of aliveEnemies) {
			const enemySkill = enemy.getAvailableSkill();
			const target = player;
			if (enemySkill && target.isAlive()) {
				enemy.applySkill(enemySkill);

				for (const effect of enemySkill.effects) {
					if (effect.type === "damage") {
						const critMultiplier = getActualCritMultiplier(
							enemy.getCombatStats()
						);
						const dmg = SkillUtil.getEffectiveDamageToTarget(
							effect,
							enemy.getCombatStats(),
							playerCombatStats,
							critMultiplier
						);
						if (typeof dmg !== "number") {
							throw new Error("Invalid damage value");
						}
						target.applyDamage(dmg);
						state.addBattleLog(
							`${enemy.getName()} utilise ${
								enemySkill.name
							} et inflige ${dmg} dégâts à l'aventurier. ${
								critMultiplier > 1 ? "Coup Critique!" : ""
							}`,
							"warning"
						);
					}
				}
			}
			if (!target.isAlive()) {
				handlePlayerDeath();
				return;
			}
		}
	}
}

function getActualCritMultiplier(stats: CombatStats): number {
	let critChance = stats.criticalChance;
	let critMultiplier = 1;
	while (critChance > 0) {
		if (Math.random() < critChance) {
			critMultiplier *= stats.criticalDamageMultiplier;
		}
		critChance -= 1;
	}
	return critMultiplier;
}

function endCombatWithVictory(enemies: Monster[]) {
	useGameStore
		.getState()
		.addBattleLog("L'aventurier a vaincu tous les ennemis !", "success");
	useMonsterStore.getState().setRespawnMonsters(true);
	RewardSystem.applyRewardDrops(enemies);
	useGameStore.getState().setInCombat(false);
	return;
	// Gérer les gains (xp, ressources...) ici
}

function handlePlayerDeath() {
	const state = useGameStore.getState();
	state.addBattleLog("L'aventurier est mort !", "danger");
	state.setBattleState(false);
	return;
	// Passage en écran de mort / déclenche prestige
}
