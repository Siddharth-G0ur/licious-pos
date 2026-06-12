import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CustomerMicrosite from './components/CustomerMicrosite/CustomerMicrosite.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pay/:orderId" element={<CustomerMicrosite />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
