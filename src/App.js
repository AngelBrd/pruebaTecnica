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
        <HeaderUpcoming title={pageTitle} />
        <Routes>
          <Route path='/order' element={<Order setPageTitle={setPageTitle} />} />
          <Route path='/cargo' element={<Cargo setPageTitle={setPageTitle} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
