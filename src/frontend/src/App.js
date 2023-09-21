// React
import React, { createContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

// Styling
import '@bcgov/bc-sans/css/BCSans.css';
import './App.scss';

// Components and functions
import Header from './Header.js';
import MapPage from './pages/MapPage';
import CamerasPage from './pages/CamerasPage';
import CameraDetailsPage from './pages/CameraDetailsPage';
import EventsPage from './pages/EventsPage';
import AdvisoriesListPage from './pages/AdvisoriesListPage';
import AdvisoryDetailsPage from './pages/AdvisoryDetailsPage';
import ScrollToTop from './Components/ScrollToTop';

export const MapContext = createContext(null);

function App() {
  function getInitialMapContext() {
    const context = localStorage.getItem('mapContext');
    return context
      ? JSON.parse(context)
      : {
          visible_layers: {
            eventsLayer: true,
            highwayLayer: false,
            open511Layer: false,
            webcamsLayer: true,
          },
        };
  }

  const [mapContext, setMapContext] = useState(getInitialMapContext());

  return (
    <MapContext.Provider value={{ mapContext, setMapContext }}>
      <div className="App">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/cameras" element={<CamerasPage />} />
          <Route path="/cameras/:id" element={<CameraDetailsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/advisories" element={<AdvisoriesListPage />} />
          <Route path="/advisories/:id" element={<AdvisoryDetailsPage />} />
        </Routes>
      </div>
    </MapContext.Provider>
  );
}

export default App;
