import { MapView } from './MapView';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <MapView />
    </div>
  );
}
