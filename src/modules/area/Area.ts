import { area as AreaData } from "../../types/area";
import { useAreaStore } from "../../store/AreaStore";
import { useMonsterStore } from "../../store/MonsterStore";
import { Monster } from "../monster/Monster";

export class Area {
	private data: AreaData;
	public maxMonsters = 10;
	private monsters: Monster[] = [];
	constructor(data: AreaData) {
		const state = useAreaStore.getState();
		state.setActiveArea(data.id);
		this.data = data;
		if (!state.monstersByArea[data.id]) {
			state.addArea(data.id, data.monsters[0].id + "0");
		}
		const monsters = state.monstersByArea[data.id] || [];
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

	isInCombat() {
		return useAreaStore.getState().battleState === "fighting";
	}

	getName() {
		return this.data.name;
	}
	getMonsters() {
		return this.monsters;
	}
	addMonster() {
		const monsters = useAreaStore.getState().monstersByArea[this.data.id];
		const monster =
			this.data.monsters[monsters.length % this.data.monsters.length];
		console.log("Monster index: ", monster);
		if (monsters.length < this.maxMonsters) {
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
}
