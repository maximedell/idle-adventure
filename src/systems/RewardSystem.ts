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
		for (const resourceId in newResources) {
			const quantity = newResources[resourceId];
			if (resources[resourceId] > quantity) {
				leftoverResources[resourceId] = resources[resourceId] - quantity;
			}
		}
		state.addBattleLog(
			this.getRewardDropText(gold, newResources, resourcesList),
			"info"
		);
		if (Object.keys(leftoverResources).length > 0) {
			state.addBattleLog(
				`L'inventaire est plein. Vous avez du laisser ${this.getResourcesText(
					leftoverResources,
					resourcesList
				)} par terre.`,
				"warning"
			);
			state.setBattleState("idle");
		}
	},
	getRewardDropText(
		gold: number,
		resources: Record<string, number>,
		resourceList: resource[]
	): string {
		let resourcesText = this.getResourcesText(resources, resourceList);
		let goldText = this.getGoldText(gold);
		if (resourcesText.length > 0 && goldText.length > 0) {
			return `L'aventurier a dépouillé les monstres et a trouvé ${goldText} et ${resourcesText}.`;
		} else if (resourcesText.length > 0) {
			return `L'aventurier a dépouillé les monstres et a trouvé ${resourcesText}.`;
		} else if (goldText.length > 0) {
			return `L'aventurier a dépouillé les monstres et a trouvé ${goldText}.`;
		} else {
			return "L'aventurier a dépouillé les monstres et n'a rien trouvé.";
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
