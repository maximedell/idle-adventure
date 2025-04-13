import { Adventurer } from "../modules/Adventurer";
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
	const area = state.activeArea;
	if (!player || !area) return;
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
			const critMultiplier = getActualCritMultiplier(player.getCombatStats());
			for (const target of targets) {
				const dmg = SkillUtil.getEffectiveDamageToTarget(
					effect,
					player.getCombatStats(),
					target.getCombatStats(),
					critMultiplier
				);
				target.applyDamage(dmg);
				state.addBattleLog(
					`L'aventurier utilise ${
						skill.name
					} et inflige ${dmg} dégâts à ${target.getName()}`,
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
		endCombatWithVictory(player, enemies);
	} else {
		for (const enemy of aliveEnemies) {
			const enemySkill = enemy.getAvailableSkill();
			const target = player;
			if (enemySkill && target.isAlive()) {
				enemy.applySkill(enemySkill);

				for (const effect of enemySkill.effects) {
					if (effect.type === "damage") {
						const dmg = SkillUtil.getEffectiveDamageToTarget(
							effect,
							enemy.getCombatStats(),
							target.getCombatStats(),
							getActualCritMultiplier(enemy.getCombatStats())
						);
						target.applyDamage(dmg);
						state.addBattleLog(
							`${enemy.getName()} utilise ${
								enemySkill.name
							} et inflige ${dmg} dégâts à l'aventurier`,
							"default"
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
	let critChance = SkillUtil.getCriticalChance(stats);
	let critMultiplier = 1;
	while (critChance > 0) {
		if (Math.random() < critChance) {
			critMultiplier *= 1 + SkillUtil.getCriticalMultiplier(stats);
		}
		critChance -= 1;
	}
	return critMultiplier;
}

function endCombatWithVictory(adventurer: Adventurer, enemies: Monster[]) {
	useGameStore
		.getState()
		.addBattleLog("L'aventurier a vaincu tous les ennemis !", "success");
	useMonsterStore.getState().setRespawnMonsters(true);
	RewardSystem.applyRewardDrops(adventurer, enemies);
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
