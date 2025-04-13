import { area as AreaData } from "../types/area";
import { useAreaStore } from "../stores/AreaStore";
import { Monster } from "./Monster";

export class Area {
	private data: AreaData;
	private monsters: Monster[] = [];
	constructor(data: AreaData) {
		const state = useAreaStore.getState();
		this.data = data;
		if (!state.monstersByArea[data.id]) {
			if (data.boss) {
				state.addArea(data.id, data.boss.id);
				console.log("Boss added to area", data.boss.id);
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
	addMonster() {
		const monsters = useAreaStore.getState().monstersByArea[this.data.id];
		const monster =
			this.data.monsters[monsters.length % this.data.monsters.length];

		if (monsters.length < this.data.size) {
			this.monsters.push(new Monster(monster, monster.id + monsters.length));
			useAreaStore
				.getState()
				.addMonsterToArea(this.data.id, monster.id + monsters.length);
		}
	}
	getMonsterByUid(uid: string) {
		const monster = this.monsters.find((m) => m.getUid() === uid);
		if (!monster) {
			return null;
		}
		return monster;
	}

	getBoss() {
		if (!this.data.boss) {
			return null;
		}
		return this.monsters[0];
	}
}
