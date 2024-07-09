import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Welcome';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import SignUpPage from './components/SignUpPage';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/welcome1" element={<Welcome />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                {/* TODO: Add routes here */}
            </Routes>
        </Router>
    );
};

export default App;

