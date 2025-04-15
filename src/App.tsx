import { AdventurerBox } from "./ui/adventurer/AdventurerBox";

import logol from "./assets/logo-l.png";
import logor from "./assets/logo-r.png";
import "./App.css";
import AreaBox from "./ui/area/AreaBox";

import BattleLog from "./ui/modal/BattleLog";
import NotificationContainer from "./ui/notification/NotificationContainer";
import InventorySidebar from "./ui/inventory/InventorySidebar";
import RegionSidebar from "./ui/region/RegionSidebar";
import Status from "./ui/modal/Status";
import Class from "./ui/modal/Class";
import { useEffect } from "react";
import { saveGame } from "./utils/SaveSystem";
import { useUIStore } from "./stores/UIStore";

function App() {
	const currentMenu = useUIStore((state) => state.currentMenu);
	const setCurrentMenu = useUIStore.getState().setCurrentMenu;

	useEffect(() => {
		const interval = setInterval(() => {
			console.log("[AutoSave] Saving game...");
			saveGame();
		}, 1000 * 10); // Save every 10 seconds
		return () => clearInterval(interval);
	}, []);
	return (
		<>
			<div className="App">
				<header className="App-header">
					<img src={logol} className="logo-l" alt="logol" />
					<h1 className="title">Idle Adventure</h1>
					<img src={logor} className="logo-r" alt="logor" />
				</header>
				<nav className="border-l border-r border-primary w-full h-8">
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("combat")}
					>
						Combat
					</button>
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("status")}
					>
						Fiche d'Aventurier
					</button>
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("craft")}
					>
						Craft
					</button>
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("shop")}
					>
						Boutique
					</button>
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("bestiary")}
					>
						Bestiaire
					</button>
					<button
						className="navbar-button"
						onClick={() => setCurrentMenu("settings")}
					>
						Options
					</button>
				</nav>
				<NotificationContainer />
				<main>
					<div className="sidebar-left">
						<InventorySidebar />
					</div>
					<div className="container-main">
						<div className="content-main">
							<AdventurerBox />
							<AreaBox />
							{currentMenu === "combat" && <BattleLog />}
							{currentMenu === "status" && <Status />}
							{currentMenu === "class" && <Class />}
						</div>
					</div>
					<div className="sidebar-right">
						<RegionSidebar />
					</div>
				</main>
				<div className="footer flex flex-col items-center">
					<p>© 2025 Idle Adventure 1.0.0</p>
					<p>
						Icons by{" "}
						<a href="https://game-icons.net" target="_blank">
							game-icons.net
						</a>
						, licensed under{" "}
						<a
							href="https://creativecommons.org/licenses/by/4.0/deed.en"
							target="_blank"
						>
							CC BY 4.0
						</a>
					</p>
				</div>
			</div>
		</>
	);
}

export default App;
