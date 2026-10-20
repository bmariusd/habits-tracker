import { HabitsFeature } from '@org/features';
import { Link, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/page-2">Page 2</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HabitsFeature />} />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back home.</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
