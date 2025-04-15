import { AreaData } from "../types/area";
import { useAreaStore } from "../stores/AreaStore";
import { Monster } from "./Monster";
import { DataUtil } from "../utils/DataUtil";

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
		console.log("Area created", data.id);
		return instance;
	}

	getId() {
		return this.data.id;
	}

	getName() {
		return this.data.name;
	}
	getSize() {
		return this.data.size;
	}
	getMonsters() {
		return this.monsters;
	}
	async addMonster() {
		const monsterIds = useAreaStore.getState().monstersByArea[this.data.id];
		const monsterId =
			this.data.monsterIds[monsterIds.length % this.data.monsterIds.length];
		const state = useAreaStore.getState();
		if (monsterIds.length < this.data.size) {
			const monsterData = await DataUtil.getMonsterById(monsterId);
			this.monsters.push(
				await Monster.create(monsterData, monsterId + monsterIds.length)
			);
			state.addMonsterToArea(this.data.id, monsterId + monsterIds.length);
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
