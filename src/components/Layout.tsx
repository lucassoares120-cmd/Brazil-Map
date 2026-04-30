import { useState } from 'react';
import { MapView } from './MapView';
import { Sidebar } from './Sidebar';
import type { UF } from '../types/geo';
import { useStateColors } from '../hooks/useStateColors';

export function Layout() {
  const [selectedUf, setSelectedUf] = useState<UF | null>(null);
  const stateColors = useStateColors();

  return (
    <div className="layout">
      <Sidebar selectedUf={selectedUf} onSelectUf={setSelectedUf} stateColors={stateColors} />
      <MapView selectedUf={selectedUf} onSelectUf={setSelectedUf} stateColors={stateColors} />
    </div>
  );
}
