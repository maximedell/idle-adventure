import { AdventurerBox } from "./ui/adventurer/AdventurerBox";

import logol from "./assets/logo-l.png";
import logor from "./assets/logo-r.png";
import "./App.css";
import AreaBox from "./ui/area/AreaBox";
import { GameLoop } from "./core/GameLoop";
import BattleLog from "./ui/battle/BattleLog";
import NotificationContainer from "./ui/notification/NotificationContainer";
import InventorySidebar from "./ui/inventory/InventorySidebar";
import RegionSidebar from "./ui/region/RegionSidebar";
import { useIsStatusOpen, useToggleStatus } from "./selectors/UISelector";
import ModalWrapper from "./ui/modal/ModalWrapper";
import StatusModal from "./ui/modal/StatusModal";

function App() {
	const isStatusOpen = useIsStatusOpen();
	const toggleStatus = useToggleStatus();
	return (
		<>
			<GameLoop />
			<div className="App">
				<header className="App-header">
					<img src={logol} className="logo-l" alt="logol" />
					<h1 className="title">Idle Adventure</h1>
					<img src={logor} className="logo-r" alt="logor" />
				</header>
				<NotificationContainer />
				<main>
					<div className="sidebar-left">
						<InventorySidebar />
					</div>
					<div className="container-main">
						<div className="content-main">
							<AdventurerBox />
							<AreaBox />
							<BattleLog />
						</div>
						{isStatusOpen && (
							<ModalWrapper onClose={() => toggleStatus()}>
								<StatusModal />
							</ModalWrapper>
						)}
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
