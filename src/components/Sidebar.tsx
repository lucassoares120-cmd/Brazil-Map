import type { UF } from '../types/geo';
import type { UseStateColorsResult } from '../hooks/useStateColors';
import { RouteForm } from './RouteForm';
import { RouteList } from './RouteList';
import { StateColorPanel } from './StateColorPanel';

export function Sidebar({
  selectedUf,
  onSelectUf,
  stateColors,
}: {
  selectedUf: UF | null;
  onSelectUf: (uf: UF) => void;
  stateColors: UseStateColorsResult;
}) {
  return (
    <aside className="sidebar">
      <h2>Controles</h2>
      <RouteForm />
      <RouteList />
      <StateColorPanel selectedUf={selectedUf} onSelectUf={onSelectUf} {...stateColors} />
    </aside>
  );
}
