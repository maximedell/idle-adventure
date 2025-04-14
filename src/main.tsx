import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GameLoop } from "./core/GameLoop";
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GameLoop />
		<App />
	</StrictMode>
);
