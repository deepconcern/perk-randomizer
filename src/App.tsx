import { FC } from "react";

import { PerkRandomizerPage } from "./pages/PerkRandomizerPage";
import { ConfigProvider } from "./providers/ConfigProvider";
import { PlayerProvider } from "./providers/PlayerProvider";

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
