import { adventurerClass } from "../../types/avdventurerClass";

export const warrior: adventurerClass = {
	id: "warrior",
	name: "Guerrier",
	baseSkillId: "minor-strike",
	talentTree: {
		id: "warrior-talent-tree",
		name: "Arbre de talents du Guerrier",
		talents: [],
	},
};
// TODO : ajouter les talents du guerrier
