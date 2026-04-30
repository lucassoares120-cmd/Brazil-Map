import { useState } from 'react';
import { ALL_UFS } from '../data/stateAbbreviations';
import type { UF } from '../types/geo';

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

  const getStateColor = (uf: UF): string => {
    return customColors[uf] ?? defaultColor;
  };

  const setStateColor = (uf: UF, color: string): void => {
    setCustomColors((prev) => ({ ...prev, [uf]: color }));
  };

  const setAllStatesColor = (color: string): void => {
    setDefaultColor(color);
    const nextCustomColors: StateColorMap = {};
    for (const uf of ALL_UFS) {
      nextCustomColors[uf] = color;
    }
    setCustomColors(nextCustomColors);
  };

  const resetStateColors = (): void => {
    setDefaultColor(INITIAL_DEFAULT_COLOR);
    setCustomColors({});
  };

  return {
    defaultColor,
    customColors,
    getStateColor,
    setDefaultColor,
    setStateColor,
    setAllStatesColor,
    resetStateColors,
  };
}
