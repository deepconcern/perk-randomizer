import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";

import { Config, ConfigContext, DEFAULT_CONFIG } from "../contexts/ConfigContext";

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<Config>(() => {
    const storedConfigData = localStorage.getItem("config");

    if (!storedConfigData) {
      localStorage.setItem("config", JSON.stringify(DEFAULT_CONFIG));

      return DEFAULT_CONFIG;
    }

    try {
      return JSON.parse(storedConfigData);
    } catch (e) {
      console.error("Inable to parse config:", e);
      localStorage.setItem("config", JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
  });

  const addRandomizingPlayerId = useCallback(
    (id: string) => {
      setConfig((c) => {
        const newConfig = {
          ...c,
          randomizingPlayerIds: [...c.randomizingPlayerIds, id],
        };

        localStorage.setItem("config", JSON.stringify(newConfig));

        return newConfig;
      });
    },
    [setConfig]
  );

  const removeRandomizingPlayerId = useCallback(
    (id: string) => {
      setConfig((c) => {
        const newConfig = {
          ...c,
          randomizingPlayerIds: c.randomizingPlayerIds.filter((r) => r !== id),
        };

        localStorage.setItem("config", JSON.stringify(newConfig));

        return newConfig;
      });
    },
    [setConfig]
  );

  const toggleAvoidingOverlapping = useCallback(() => {
    setConfig((c) => {
      const newConfig = {
        ...c,
        isAvoidingOverlapping: !c.isAvoidingOverlapping,
      };

      localStorage.setItem("config", JSON.stringify(newConfig));

      return newConfig;
    });
  }, [setConfig]);

  const value = useMemo(
    () => ({
      addRandomizingPlayerId,
      isAvoidingOverlapping: config.isAvoidingOverlapping,
      randomizingPlayerIds: config.randomizingPlayerIds,
      removeRandomizingPlayerId,
      toggleAvoidingOverlapping,
    }),
    [
      addRandomizingPlayerId,
      config,
      removeRandomizingPlayerId,
      toggleAvoidingOverlapping,
    ]
  );
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
