import { AreaData } from "../types/area";
import { useAreaStore } from "../stores/AreaStore";
import { Monster } from "./Monster";
import { DataUtil } from "../utils/DataUtil";

export class Area {
	private data: AreaData = {} as AreaData;
	private monsters: Monster[] = [];

	constructor(data: AreaData) {}
	/* 	
	constructor(data: AreaData) {
		const state = useAreaStore.getState();
		this.data = data;
		if (!state.monstersByArea[data.id]) {
			if (data.isBossArea) {
				state.addArea(data.id, data.monsters[0].id);
			} else {
				state.addArea(data.id, data.monsters[0].id + "0");
				console.log("Monster added to area", data.monsters[0].id + "0");
			}
		}
		const monsters = useAreaStore.getState().monstersByArea[data.id] || [];
		console.log(monsters);
		let counter = 0;
		for (const monsterUid of monsters) {
			const monster = data.monsters.find(
				(m) => m.id === data.monsters[counter].id
			);
			if (!monster) continue;
			this.monsters.push(new Monster(monster, monsterUid));
			counter++;
		}

		console.log("Area created", data.id);
	}
 */
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
		}
		const monsters = useAreaStore.getState().monstersByArea[data.id] || [];
		let counter = 0;
		for (const monsterUid of monsters) {
			const monsterId = data.monsterIds.find(
				(m) => m === data.monsterIds[counter]
			);
			if (!monsterId) continue;
			const monsterData = await DataUtil.getMonsterById(monsterId);
			instance.monsters.push(new Monster(monsterData, monsterUid));
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

		if (monsterIds.length < this.data.size) {
			const monsterData = await DataUtil.getMonsterById(monsterId);
			this.monsters.push(
				new Monster(monsterData, monsterId + monsterIds.length)
			);
			useAreaStore
				.getState()
				.addMonsterToArea(this.data.id, monsterId + monsterIds.length);
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
