/** App root – layout with sidebar + full-screen map. */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/Sidebar/Sidebar';
import MapContainer from './components/Map/MapContainer';
import './App.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-layout">
        <Sidebar />
        <main className="map-area">
          <MapContainer />
        </main>
      </div>
    </QueryClientProvider>
  );
}

