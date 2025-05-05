import { Adventurer } from "../modules/Adventurer";
import { Monster } from "../modules/Monster";
import { ResourceDropData } from "../types/monster";
import { useGameStore } from "../stores/GameStore";
import { DataUtil } from "../utils/DataUtil";
import { useInventoryStore } from "../stores/InventoryStore";
export const RewardSystem = {
	/**
	 * Calculates and apply the rewarded experience for defeating a monster.
	 * @param {Adventurer} adventurer - The adventurer who defeated the monster.
	 * @param {Monster} monster - The monster that was defeated.
	 * @returns {number} - The calculated rewarded experience.
	 */
	applyRewardExperience(adventurer: Adventurer, monster: Monster) {
		const baseExperience = monster.getData().rewards.experience;
		const experienceReward = this.getRewardedExperience(
			adventurer.getLevel(),
			monster.getLevel(),
			baseExperience
		);
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

	getRewardedExperience(
		adventurerLevel: number,
		monsterLevel: number,
		baseExperience: number
	): number {
		const levelDifference = adventurerLevel - monsterLevel;
		const levelDifferenceFactor = Math.max(0, 1 - 0.2 * levelDifference);
		const experienceReward = Math.floor(baseExperience * levelDifferenceFactor);
		return experienceReward;
	},

	async applyRewardDrops(monsters: Monster[]) {
		const state = useGameStore.getState();
		let resources: Record<string, number> = {};
		let gold = 0;
		const resourceIdsList = monsters
			.flatMap((monster) => monster.getData().rewards.resourceDrops || [])
			.flatMap((resourceDrop) => resourceDrop.resourceId);
		for (const monster of monsters) {
			const monsterData = monster.getData();
			if (monsterData.rewards.resourceDrops) {
				for (const resourceDrop of monsterData.rewards.resourceDrops) {
					const resourceId = resourceDrop.resourceId;
					if (!resources[resourceId]) {
						resources[resourceId] = 0;
					}
					const amount = this.rollResources(resourceDrop);
					resources[resourceId] += amount;
				}
			}
			gold += Math.max(0, Math.floor(Math.random() * monsterData.rewards.gold));
		}
		const newResources = this.addResourcesToInventory(resources);
		let leftoverResources: Record<string, number> = {};
		for (const resourceId in resources) {
			if (!newResources[resourceId]) {
				leftoverResources[resourceId] = resources[resourceId];
			} else if (newResources[resourceId] < resources[resourceId]) {
				leftoverResources[resourceId] =
					resources[resourceId] - newResources[resourceId];
			}
		}
		const rewardDropText = await this.getRewardDropText(
			gold,
			newResources,
			resourceIdsList,
			leftoverResources
		);
		state.addBattleLog(rewardDropText, "info");
		if (
			Object.values(leftoverResources).reduce((acc, value) => acc + value, 0) >
			0
		) {
			state.addBattleLog("Combat mis en pause (inventaire plein)", "danger");
			state.setBattleState(false);
		}
	},
	async getRewardDropText(
		gold: number,
		resources: Record<string, number>,
		resourceIdsList: string[],
		leftoverResources: Record<string, number>
	): Promise<string> {
		let resourcesText = await this.getResourcesText(resources, resourceIdsList);
		let goldText = this.getGoldText(gold);
		let leftoverResourcesText = await this.getResourcesText(
			leftoverResources,
			resourceIdsList
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
	async getResourcesText(
		resourcesRecord: Record<string, number>,
		resourceIdsList: string[]
	): Promise<string> {
		if (Object.keys(resourcesRecord).length === 0) {
			return "";
		}
		let resourcesText = "";
		for (const resourceId in resourcesRecord) {
			const id = resourceIdsList.find((r) => r === resourceId);
			if (!id) continue;
			const resource = await DataUtil.getResourceById(id);
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

	rollResources(resourceDrop: ResourceDropData): number {
		const dropRate = resourceDrop.dropRate;
		const quantity = resourceDrop.amount;
		let amount = 0;
		if (Math.random() * 100 < dropRate) {
			amount = Math.max(1, Math.floor(Math.random() * quantity));
		}
		return amount;
	},

	addResourcesToInventory(
		resources: Record<string, number>
	): Record<string, number> {
		let state = useInventoryStore.getState();
		const inventoryResources = state.resources;
		const inventorySizeMax = state.size;
		const inventorySize = Object.keys(inventoryResources).reduce(
			(acc, key) => acc + inventoryResources[key],
			0
		);
		const newResources: Record<string, number> = {};
		let currentSize = inventorySize;
		for (const resourceId in resources) {
			state = useInventoryStore.getState();
			if (currentSize >= inventorySizeMax) break;
			const quantity = resources[resourceId];
			if (quantity <= 0) continue;
			if (!state.discoveredResources.includes(resourceId))
				state.addDiscoveredResource(resourceId);
			if (currentSize + quantity <= inventorySizeMax) {
				newResources[resourceId] = quantity;
				currentSize += quantity;
			} else {
				newResources[resourceId] = inventorySizeMax - currentSize;
				currentSize = inventorySizeMax;
			}
		}
		for (const resourceId in newResources) {
			const quantity = newResources[resourceId];
			state.addResource(resourceId, quantity);
		}
		return newResources;
	},
};
