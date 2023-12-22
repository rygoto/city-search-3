import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitySphere from '../src/component/Cityspheredisplay.jsx';
import Other from './App.jsx';
import Other2 from './App2.jsx';
import Other3 from './App3.jsx';
import ReviewApp from './Review.jsx';
import OtherTryApp from './Othertry.jsx';
import Review from './Reviewdisplay.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<CitySphere />} />
                <Route path='/city1' element={<Other />} />
                <Route path='/city2' element={<Other2 />} />
                <Route path='/city3' element={<Other3 />} />
                <Route path='/review' element={<ReviewApp />} />
                <Route path='/othertry' element={<OtherTryApp />} />
                <Route path='/reviewshow' element={<Review />} />
            </Routes>
        </Router>
    );
};

export default App;