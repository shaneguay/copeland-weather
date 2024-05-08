import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Weather from './pages/Weather';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Weather />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
