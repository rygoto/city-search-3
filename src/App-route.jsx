import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitySphere from './Citysphere.jsx';
import Other from './App.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<CitySphere />} />
                <Route path='/other' element={<Other />} />
            </Routes>
        </Router>
    );
};

export default App;