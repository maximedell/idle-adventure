import { AreaData } from "../types/area";
import { useAreaStore } from "../stores/AreaStore";
import { Monster } from "./Monster";
import { DataUtil } from "../utils/DataUtil";
import { useGameStore } from "../stores/GameStore";

export class Area {
	private data: AreaData = {} as AreaData;
	private monsters: Monster[] = [];

	constructor(data: AreaData) {}
	static async create(data: AreaData): Promise<Area> {
		const instance = new Area(data);
		const state = useAreaStore.getState();
		instance.data = data;
		if (!state.monstersByArea[data.id]) {
			if (data.isBossArea) {
				state.addArea(data.id, data.monsterIds[0]);
			} else {
				state.addArea(data.id, data.monsterIds[0] + "0");
			}
			if (!state.discoveredMonsters.includes(data.id)) {
				state.addDiscoveredMonster(data.id);
			}
		}
		const monsters = useAreaStore.getState().monstersByArea[data.id] || [];
		let counter = 0;
		for (const monsterUid of monsters) {
			const monsterId = data.monsterIds.find(
				(m) => m === data.monsterIds[counter % data.monsterIds.length]
			);
			if (!monsterId) continue;
			const monsterData = await DataUtil.getMonsterById(monsterId);
			const newMonster = await Monster.create(monsterData, monsterUid);
			instance.monsters.push(newMonster);
			counter++;
		}
		state.setActiveAreaId(data.id);
		useGameStore.setState({ area: instance });
		console.log("Area created", data.id);
		return instance;
	}

	addArea() {
		const state = useAreaStore.getState();
		if (this.data.isBossArea) {
			state.addArea(this.data.id, this.data.monsterIds[0]);
		} else {
			state.addArea(this.data.id, this.data.monsterIds[0] + "0");
		}
		if (state.discoveredMonsters.includes(this.data.monsterIds[0])) {
			state.addDiscoveredMonster(this.data.monsterIds[0]);
		}
		if (!state.monsterMaxPerArea[this.data.id]) {
			state.setMonsterMaxPerArea(this.data.id, this.data.size);
		}
	}

	getId() {
		return this.data.id;
	}

	getName() {
		return this.data.name;
	}
	getMaxMonster() {
		return useAreaStore.getState().monsterMaxPerArea[this.data.id];
	}
	getMonsters() {
		return this.monsters;
	}
	async addMonster() {
		const state = useAreaStore.getState();
		const monsterUids = state.monstersByArea[this.data.id];
		const monsterId =
			this.data.monsterIds[monsterUids.length % this.data.monsterIds.length];
		if (monsterUids.length < state.monsterMaxPerArea[this.data.id]) {
			const monsterData = await DataUtil.getMonsterById(monsterId);
			this.monsters.push(
				await Monster.create(monsterData, monsterId + monsterUids.length)
			);
			state.addMonsterToArea(this.data.id, monsterId + monsterUids.length);
		}
		if (!state.discoveredMonsters.includes(monsterId)) {
			state.addDiscoveredMonster(monsterId);
		}
	}
	getMonsterByUid(uid: string) {
		const monster = this.monsters.find((m) => m.getUid() === uid);
		if (!monster) {
			return null;
		}
		return monster;
	}

	isBossArea() {
		return this.data.isBossArea;
	}
}
