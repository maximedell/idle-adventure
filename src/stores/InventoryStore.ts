import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface InventoryState {
	size: number;
	items: Record<string, number>;
	resources: Record<string, number>;
	gold: number;
	discoveredResources: string[];
}

interface InventoryActions {
	addItem: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string, quantity: number) => void;
	addResource: (resourceId: string, quantity: number) => void;
	removeResource: (resourceId: string, quantity: number) => void;
	sellResource: (resourceId: string, value: number) => void;
	addGold: (amount: number) => void;
	removeGold: (amount: number) => void;
	setSize: (size: number) => void;
	initStore: (inventory: {
		size: number;
		items: Record<string, number>;
		resources: Record<string, number>;
		gold: number;
		discoveredResources: string[];
	}) => void;
	addDiscoveredResource: (resourceId: string) => void;
}

interface InventoryStore extends InventoryState, InventoryActions {}

export const useInventoryStore = create<InventoryStore>()(
	subscribeWithSelector((set) => ({
		size: 20,
		items: {},
		resources: {},
		gold: 0,
		discoveredResources: [],
		addItem: (itemId: string, quantity: number) =>
			set((state) => {
				const currentQuantity = state.items[itemId] || 0;
				return {
					items: { ...state.items, [itemId]: currentQuantity + quantity },
				};
			}),
		removeItem: (itemId: string, quantity: number) =>
			set((state) => {
				const currentQuantity = state.items[itemId] || 0;
				if (currentQuantity <= quantity) {
					const { [itemId]: _, ...rest } = state.items;
					return { items: rest };
				}
				return {
					items: { ...state.items, [itemId]: currentQuantity - quantity },
				};
			}),
		addResource: (resourceId: string, quantity: number) =>
			set((state) => {
				const currentQuantity = state.resources[resourceId] || 0;
				return {
					resources: {
						...state.resources,
						[resourceId]: currentQuantity + quantity,
					},
				};
			}),
		removeResource: (resourceId: string, quantity: number) =>
			set((state) => {
				const currentQuantity = state.resources[resourceId] || 0;
				if (currentQuantity <= quantity) {
					const { [resourceId]: _, ...rest } = state.resources;
					return { resources: rest };
				}
				return {
					resources: {
						...state.resources,
						[resourceId]: currentQuantity - quantity,
					},
				};
			}),
		addGold: (amount: number) =>
			set((state) => ({
				gold: state.gold + amount,
			})),
		removeGold: (amount: number) =>
			set((state) => ({
				gold: Math.max(0, state.gold - amount),
			})),
		setSize: (size: number) =>
			set(() => ({
				size,
			})),
		sellResource: (resourceId: string, value: number) =>
			set((state) => ({
				resources: { ...state.resources, [resourceId]: 0 },
				gold: state.gold + value,
			})),
		initStore: (inventory: {
			size: number;
			items: Record<string, number>;
			resources: Record<string, number>;
			gold: number;
			discoveredResources: string[];
		}) =>
			set(() => ({
				size: inventory.size,
				items: inventory.items,
				resources: inventory.resources,
				gold: inventory.gold,
				discoveredResources: inventory.discoveredResources,
			})),
		addDiscoveredResource: (resourceId: string) =>
			set((state) => ({
				discoveredResources: [
					...new Set([...state.discoveredResources, resourceId]),
				],
			})),
	}))
);
