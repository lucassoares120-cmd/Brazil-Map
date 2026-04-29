import { useMemo, useState } from 'react';
import { ALL_UFS } from '../data/stateAbbreviations';
import type { UF } from '../types/geo';

const INITIAL_DEFAULT_COLOR = '#dbeafe';

type UseStateColorsResult = {
  defaultColor: string;
  customColors: Partial<Record<UF, string>>;
  getStateColor: (uf: UF) => string;
  setDefaultColor: (color: string) => void;
  setStateColor: (uf: UF, color: string) => void;
  setAllStatesColor: (color: string) => void;
  resetStateColors: () => void;
};

export function useStateColors(): UseStateColorsResult {
  const [defaultColor, setDefaultColorState] = useState<string>(INITIAL_DEFAULT_COLOR);
  const [customColors, setCustomColors] = useState<Partial<Record<UF, string>>>({});

  const setDefaultColor = (color: string) => {
    setDefaultColorState(color);
  };

  const setStateColor = (uf: UF, color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [uf]: color,
    }));
  };

  const setAllStatesColor = (color: string) => {
    setDefaultColorState(color);
    const allStatesWithColor = ALL_UFS.reduce<Partial<Record<UF, string>>>((acc, uf) => {
      acc[uf] = color;
      return acc;
    }, {});
    setCustomColors(allStatesWithColor);
  };

  const resetStateColors = () => {
    setDefaultColorState(INITIAL_DEFAULT_COLOR);
    setCustomColors({});
  };

  const getStateColor = (uf: UF) => customColors[uf] ?? defaultColor;

  return useMemo(
    () => ({
      defaultColor,
      customColors,
      getStateColor,
      setDefaultColor,
      setStateColor,
      setAllStatesColor,
      resetStateColors,
    }),
    [defaultColor, customColors],
  );
}
