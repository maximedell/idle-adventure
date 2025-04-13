import { Adventurer } from "../modules/Adventurer";
import { Monster } from "../modules/Monster";
import { resourceDrop } from "../types/monster";
import { useGameStore } from "../stores/GameStore";
import { resource } from "../types/resource";
export const RewardSystem = {
	/**
	 * Calculates and apply the rewarded experience for defeating a monster.
	 * @param {Adventurer} adventurer - The adventurer who defeated the monster.
	 * @param {Monster} monster - The monster that was defeated.
	 * @returns {number} - The calculated rewarded experience.
	 */
	applyRewardExperience(adventurer: Adventurer, monster: Monster) {
		const baseExperience = monster.getData().rewards.experience;
		const levelDifference =
			adventurer.getStats().level - monster.getStats().level;
		const levelDifferenceFactor = Math.max(0, 1 - 0.2 * levelDifference);
		const experienceReward = Math.floor(baseExperience * levelDifferenceFactor);
		adventurer.gainExperience(experienceReward);
		useGameStore
			.getState()
			.addBattleLog(
				`L'aventurer a gagné ${experienceReward} exp en tuant ${
					monster.getData().name
				}.`,
				"info"
			);
	},

	applyRewardDrops(adventurer: Adventurer, monsters: Monster[]) {
		const state = useGameStore.getState();
		let resources: Record<string, number> = {};
		let gold = 0;
		const resourcesList = monsters
			.flatMap((monster) => monster.getData().rewards.resources || [])
			.flatMap((resourceDrop) => resourceDrop.resource);
		for (const monster of monsters) {
			const monsterData = monster.getData();
			if (monsterData.rewards.resources) {
				for (const resourceDrop of monsterData.rewards.resources) {
					const resource = resourceDrop.resource;
					if (!resources[resource.id]) {
						resources[resource.id] = 0;
					}
					const amount = this.rollResources(resourceDrop);
					resources[resource.id] += amount;
				}
			}
			gold += Math.max(0, Math.floor(Math.random() * monsterData.rewards.gold));
		}
		const newResources = adventurer.addResourcesToInventory(resources);
		let leftoverResources: Record<string, number> = {};
		for (const resourceId in resources) {
			if (!newResources[resourceId]) {
				leftoverResources[resourceId] = resources[resourceId];
			} else if (newResources[resourceId] < resources[resourceId]) {
				leftoverResources[resourceId] =
					resources[resourceId] - newResources[resourceId];
			}
		}
		state.addBattleLog(
			this.getRewardDropText(
				gold,
				newResources,
				resourcesList,
				leftoverResources
			),
			"info"
		);
		if (
			Object.values(leftoverResources).reduce((acc, value) => acc + value, 0) >
			0
		) {
			state.addBattleLog("Combat mis en pause (inventaire plein)", "danger");
			state.setBattleState(false);
		}
	},
	getRewardDropText(
		gold: number,
		resources: Record<string, number>,
		resourceList: resource[],
		leftoverResources: Record<string, number>
	): string {
		let resourcesText = this.getResourcesText(resources, resourceList);
		let goldText = this.getGoldText(gold);
		let leftoverResourcesText = this.getResourcesText(
			leftoverResources,
			resourceList
		);
		if (leftoverResourcesText.length > 0) {
			leftoverResourcesText = `Vous n'avez pas assez de place dans votre inventaire pour ramasser ${leftoverResourcesText}.`;
		}
		if (resourcesText.length > 0 && goldText.length > 0) {
			return `Vous avez ramassé ${resourcesText} et ${goldText} pièces d'or. ${leftoverResourcesText}`;
		} else if (resourcesText.length > 0) {
			return `Vous avez ramassé ${resourcesText}. ${leftoverResourcesText}`;
		} else if (goldText.length > 0) {
			return `Vous avez ramassé ${goldText} pièces d'or. ${leftoverResourcesText}`;
		} else if (leftoverResourcesText.length > 0) {
			return leftoverResourcesText;
		} else {
			return `Vous n'avez rien ramassé.`;
		}
	},
	getGoldText(gold: number): string {
		if (gold === 0) {
			return "";
		}
		return `${gold} or`;
	},
	getResourcesText(
		resourcesRecord: Record<string, number>,
		resourceList: resource[]
	): string {
		if (Object.keys(resourcesRecord).length === 0) {
			return "";
		}
		let resourcesText = "";
		for (const resourceId in resourcesRecord) {
			const resource = resourceList.find((r) => r.id === resourceId);
			if (resource && resourcesRecord[resourceId] > 0) {
				resourcesText += `${resourcesRecord[resourceId]} ${resource.name}, `;
			}
		}
		if (resourcesText.length > 0) {
			resourcesText = resourcesText.slice(0, -2); // Remove the last comma and space
		} else {
			resourcesText = "";
		}
		return resourcesText;
	},

	rollResources(resourceDrop: resourceDrop): number {
		const dropRate = resourceDrop.dropRate;
		const resource = resourceDrop.resource;
		const quantity = resource.quantity;
		let amount = 0;
		if (Math.random() * 100 < dropRate) {
			amount = Math.max(1, Math.floor(Math.random() * quantity));
		}
		return amount;
	},
};
