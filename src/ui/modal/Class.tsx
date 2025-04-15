import type { Class } from "../../types/class";
import { DataUtil } from "../../utils/DataUtil";
import TalentTree from "../class/TalentTree";
import { useState, useEffect } from "react";
export default function Class() {
	const [devClasses, setDevClasses] = useState<Record<string, boolean>>({});
	const [classes, setClasses] = useState<Class[]>([]);
	useEffect(() => {
		setClasses(DataUtil.getAllClasses());
	}, []);
	useEffect(() => {
		const initialDevClasses = classes.reduce((acc, cls) => {
			acc[cls.id] = false;
			return acc;
		}, {} as Record<string, boolean>);
		setDevClasses(initialDevClasses);
	}, [classes]);
	return (
		<div className="box-content">
			{classes.map((cls) => (
				<div key={cls.id} className="flex flex-col w-full">
					<h2 className="text-lg font-bold text-center">{cls.name}</h2>
					<button className="mt-4 bg-primary-light text-accent font-bold w-fit p-1 px-2 rounded-lg m-auto">
						Choisir cette classe
					</button>
					<button
						onClick={() =>
							setDevClasses((prev) => ({
								...prev,
								[cls.id]: !prev[cls.id],
							}))
						}
						className="mt-4 bg-primary-light text-black w-fit p-1 px-2 rounded-lg m-auto"
					>
						Voir l'arbre de talents
					</button>
					{devClasses[cls.id] && <TalentTree classId={cls.id} />}
				</div>
			))}
		</div>
	);
}
