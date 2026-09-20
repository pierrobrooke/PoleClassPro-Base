import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import MovesDatabase from './pages/MovesDatabase';
import ComboBuilder from './pages/ComboBuilder';
import ClassSummary from './pages/ClassSummary';
import Templates from './pages/Templates';
import AIGenerator from './pages/AIGenerator';
import SharedCombo from './pages/SharedCombo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/moves" element={<MovesDatabase />} />
        <Route path="/combo" element={<ComboBuilder />} />
        <Route path="/summary" element={<ClassSummary />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/ai-generator" element={<AIGenerator />} />
        <Route path="/shared/:shareId" element={<SharedCombo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;