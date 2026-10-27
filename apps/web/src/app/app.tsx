import { HabitsFeature } from '@org/features';
import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="*" element={<HabitsFeature />} />
    </Routes>
  );
}

export default App;
