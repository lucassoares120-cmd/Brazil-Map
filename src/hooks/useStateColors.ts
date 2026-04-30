import { useEffect, useMemo, useState } from 'react';
import { ALL_UFS } from '../data/stateAbbreviations';
import type { UF } from '../types/geo';

const STORAGE_KEY = 'brazil-map:state-colors:v1';
const INITIAL_DEFAULT_COLOR = '#dbeafe';

type StateColorMap = Partial<Record<UF, string>>;

export type UseStateColorsResult = {
  defaultColor: string;
  customColors: StateColorMap;
  getStateColor: (uf: UF) => string;
  setDefaultColor: (color: string) => void;
  setStateColor: (uf: UF, color: string) => void;
  setAllStatesColor: (color: string) => void;
  resetStateColors: () => void;
};

export function useStateColors(): UseStateColorsResult {
  const [defaultColor, setDefaultColor] = useState(INITIAL_DEFAULT_COLOR);
  const [customColors, setCustomColors] = useState<StateColorMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { defaultColor?: string; customColors?: StateColorMap };
      if (parsed.defaultColor) setDefaultColor(parsed.defaultColor);
      if (parsed.customColors) setCustomColors(parsed.customColors);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ defaultColor, customColors }));
  }, [defaultColor, customColors]);

  const getStateColor = (uf: UF): string => customColors[uf] ?? defaultColor;

  const setStateColor = (uf: UF, color: string): void => setCustomColors((prev) => ({ ...prev, [uf]: color }));

  const setAllStatesColor = (color: string): void => {
    setDefaultColor(color);
    const nextCustomColors: StateColorMap = {};
    for (const uf of ALL_UFS) nextCustomColors[uf] = color;
    setCustomColors(nextCustomColors);
  };

  const resetStateColors = (): void => {
    setDefaultColor(INITIAL_DEFAULT_COLOR);
    setCustomColors({});
  };

  return useMemo(
    () => ({ defaultColor, customColors, getStateColor, setDefaultColor, setStateColor, setAllStatesColor, resetStateColors }),
    [defaultColor, customColors],
  );
}
