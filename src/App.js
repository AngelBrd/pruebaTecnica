import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeaderUpcoming } from './components/Header/HeaderUpcoming';
import { Order } from './components/Order/Order';
import Cargo from './components/CargoDetails/Cargo';

function App() {
  const [pageTitle, setPageTitle] = useState("Upcoming");

  return (
    <div className="">
      <Router>
        {/* Encabezado que se renderiza en toda la aplicación */}
        <HeaderUpcoming title={pageTitle} />
        <Routes>
          {/* Ruta para Order */}
          <Route path='/order' element={<Order setPageTitle={setPageTitle} />} />
          {/* Ruta para Cargo */}
          <Route path='/cargo' element={<Cargo setPageTitle={setPageTitle} />} />
          {/* Ruta por defecto */}
          <Route path='/*' element={<DefaultPage setPageTitle={setPageTitle} />} />
        </Routes>
      </Router>
    </div>
  );
}

// Componente DefaultPage que renderiza solo el componente Order y no el encabezado
function DefaultPage({ setPageTitle }) {
  return (
    <Order setPageTitle={setPageTitle} />
  );
}

export default App;
