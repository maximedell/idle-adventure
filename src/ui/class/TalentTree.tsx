import TalentNode from "./TalentNode";
import { DataUtil } from "../../utils/DataUtil";
import { useEffect, useRef, useState } from "react";
type TalentTreeProps = {
	classId: string;
};

export default function TalentTree({ classId }: TalentTreeProps) {
	const [lines, setLines] = useState<any[]>([]);
	const classData = DataUtil.getClassById(classId);
	const gridRef = useRef<HTMLDivElement>(null);
	const talents = classData.talents;
	const maxX = Math.max(...talents.map((t) => t.x ?? 0));
	const maxY = Math.max(...talents.map((t) => t.y ?? 0));
	useEffect(() => {
		if (!gridRef.current) return;

		const rect = gridRef.current.getBoundingClientRect();
		const cellWidth = rect.width / (maxX + 1);
		const cellHeight = rect.height / (maxY + 1);

		const rootX = (maxX + 1) / 2 - 0.5;

		const map = Object.fromEntries(talents.map((t) => [t.id, t]));
		const links = talents.flatMap((talent) =>
			talent.requiredTalentIds
				.map((id) => {
					const from = map[id];
					if (!from) return null;

					const fromX =
						from.requiredTalentIds.length === 0 ? rootX : from.x ?? 0;

					return {
						from: {
							x: (fromX + 0.5) * cellWidth,
							y: ((from.y ?? 0) + 0.5) * cellHeight,
						},
						to: {
							x: ((talent.x ?? 0) + 0.5) * cellWidth,
							y: ((talent.y ?? 0) + 0.5) * cellHeight,
						},
					};
				})
				.filter(Boolean)
		);

		setLines(links);
	}, [classData]);

	return (
		<div ref={gridRef} className="relative w-full h-full">
			{/* SVG pour les lignes */}
			<svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
				{lines.map((line, i) => (
					<line
						key={i}
						x1={line.from.x}
						y1={line.from.y}
						x2={line.to.x}
						y2={line.to.y}
						stroke="white"
						strokeWidth="2"
					/>
				))}
			</svg>
			<div
				className="grid gap-4 p-4 relative z-10"
				style={{
					gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${maxY + 1}, auto)`,
				}}
			>
				{talents.map((talent) => {
					const isRoot = talent.requiredTalentIds.length === 0;

					return (
						<div
							key={talent.id}
							className="flex justify-center"
							style={{
								gridColumn: `${(talent.x ?? 0) + 1} / span ${
									isRoot ? maxX + 1 : 1
								}`,
								gridRow: `${(talent.y ?? 0) + 1}`,
							}}
						>
							<TalentNode talent={talent} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
