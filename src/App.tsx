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
import { saveGame } from "./systems/SaveSystem";
import { useUIStore } from "./stores/UIStore";
import Shop from "./ui/modal/Shop";
import Settings from "./ui/modal/Settings";

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
			<div className="h-full flex flex-col items-center mx-auto w-full text-primary-light">
				<header className="w-full h-12 flex justify-between items-center border-b border-accent shadow-md">
					<img src={logol} className="h-12" alt="logol" />
					<h1 className="title">Idle Adventure</h1>
					<img src={logor} className="h-12" alt="logor" />
				</header>
				<nav className="border-l border-r border-primary w-full h-8 bg-primary-light">
					<div className="flex flex-row max-w-7xl w-full mx-auto">
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
					</div>
				</nav>
				<NotificationContainer />
				<main className="flex flex-row  w-full h-full justify-between ">
					<div className="sidebar-right w-1/5 max-w-60 p-0 mr-8">
						<RegionSidebar />
					</div>
					<div className="content-main flex flex-col max-w-6xl items-center justify-center mt-4 h-fit w-full mx-auto">
						<AdventurerBox />
						<AreaBox />
						{currentMenu === "combat" && <BattleLog />}
						{currentMenu === "status" && <Status />}
						{currentMenu === "class" && <Class />}
						{currentMenu === "shop" && <Shop />}
						{currentMenu === "settings" && <Settings />}
					</div>
					<div className="sidebar-left w-1/5 max-w-60 p-2 ml-8">
						<InventorySidebar />
					</div>
				</main>
				<div className="footer flex flex-col items-center relative bottom-0 w-full h-12 border-t border-primary pt-2">
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
