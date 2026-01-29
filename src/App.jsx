import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Event from './pages/Event';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/event/:id" element={<Event />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
