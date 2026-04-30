import { RouteForm } from './RouteForm';
import { RouteList } from './RouteList';
import { StateColorPanel } from './StateColorPanel';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Controles</h2>
      <RouteForm />
      <RouteList />
      <StateColorPanel />
    </aside>
  );
}
