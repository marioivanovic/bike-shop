import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { AuthProvider } from './hooks/useAuth';
import Home from './components/pages/Home';
import BikeCard from './components/bikes/bikeCard';
import RegisterForm from './components/auth/signUpForm';
import './App.css';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <nav>
            <Link to="/homepage">Home</Link>
            <Link to="/bikes">Bikes</Link>
            <Link to="/signUp">Sign Up</Link>
          </nav>

          <Routes>
            <Route path="/homepage" element={<Home />} />
            <Route path="/bikes" element={<BikeCard />} />
            <Route path="/signUp" element={<RegisterForm />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
