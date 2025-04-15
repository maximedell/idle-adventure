import { Talent } from "../../types/class";

export default function TalentNode({ talent }: { talent: Talent }) {
	return (
		<div className="bg-zinc-800 border border-zinc-500 rounded p-2 w-32 text-white text-sm text-center cursor-pointer">
			<strong>{talent.name}</strong>
		</div>
	);
}
