import { startGame } from "../../systems/SaveSystem";
export default function Settings() {
	const handleClick = () => {
		startGame();
	};
	return (
		<div className="box-content">
			<button className="btn" onClick={handleClick}>
				Start new game
			</button>
		</div>
	);
}
