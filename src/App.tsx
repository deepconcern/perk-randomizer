import { FC } from "react";

import { ConfigProvider } from "./contexts/config";
import { PlayerProvider } from "./contexts/player";
import { PerkRandomizerPage } from "./pages/PerkRandomizerPage";

export const App: FC = () => (
  <PlayerProvider>
    <ConfigProvider>
      <header>
        <h1>DBD Perk Randomizer</h1>
      </header>
      <main>
        <PerkRandomizerPage />
      </main>
    </ConfigProvider>
  </PlayerProvider>
);
