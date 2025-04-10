import { AdventurerBox } from "./ui/adventurer/AdventurerBox";

import logol from "./assets/logo-l.png";
import logor from "./assets/logo-r.png";
import "./App.css";
import AreaBox from "./ui/area/AreaBox";
import { GameLoop } from "./core/GameLoop";

function App() {
	return (
		<>
			<GameLoop />
			<div className="App">
				<header className="App-header">
					<img src={logol} className="logo-l" alt="logol" />
					<h1 className="title">Idle Adventure</h1>
					<img src={logor} className="logo-r" alt="logor" />
				</header>
				<main>
					<div className="sidebar-left"></div>
					<div className="container-main">
						<div className="content-main">
							<AdventurerBox />
							<AreaBox />
						</div>
					</div>
					<div className="sidebar-right"></div>
				</main>
				<div className="footer"></div>
			</div>
		</>
	);
}

export default App;
