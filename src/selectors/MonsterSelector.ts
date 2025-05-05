import { useMonsterStore } from "../stores/MonsterStore";
import { useGameStore } from "../stores/GameStore";

export const useMonsterHealth = (monsterUid: string | undefined) => {
	return monsterUid ? useMonsterStore((state) => state.health[monsterUid]) : 0;
};

export const useMonsterMana = (monsterUid: string | undefined) => {
	return monsterUid ? useMonsterStore((state) => state.mana[monsterUid]) : 0;
};

export const useReviveTimer = (monsterUid: string | undefined) => {
	return monsterUid
		? useMonsterStore((state) => state.reviveBuffer[monsterUid])
		: 0;
};

export const useMonsterSkillCooldown = (
	monsterUid: string,
	skillId: string
) => {
	return useMonsterStore((state) => state.cooldowns[monsterUid][skillId]);
};
