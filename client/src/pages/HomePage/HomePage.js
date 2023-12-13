import React from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
  <>
    <div className="homepage">
      <header className="header">
        <h1>TELL A STORY WITH YOUR VOICE</h1>
        <Link to="/register" className="register-now-btn">REGISTER NOW</Link>
      </header>
    </div>
  </>
  );
}

export default HomePage;
