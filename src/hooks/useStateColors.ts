import { useMemo, useState } from 'react';
import type { StateColorConfig, UF } from '../types/geo';

const INITIAL_DEFAULT_COLOR = '#dbeafe';

export function useStateColors() {
  const [config, setConfig] = useState<StateColorConfig>({
    defaultColor: INITIAL_DEFAULT_COLOR,
    customColors: {},
  });

  const setDefaultColor = (color: string) => {
    setConfig((prev) => ({ ...prev, defaultColor: color }));
  };

  const setStateColor = (uf: UF, color: string) => {
    setConfig((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, [uf]: color },
    }));
  };

  const resetStateColor = (uf: UF) => {
    setConfig((prev) => {
      const next = { ...prev.customColors };
      delete next[uf];
      return { ...prev, customColors: next };
    });
  };

  const getStateColor = (uf: UF) => config.customColors[uf] ?? config.defaultColor;

  return useMemo(() => ({ config, setDefaultColor, setStateColor, resetStateColor, getStateColor }), [config]);
}
