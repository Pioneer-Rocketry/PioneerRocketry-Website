import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <section id="header" className="wrapper">
            {/* Logo */}
            <div id="logo">
                <h1><Link to="/">Pioneer Rocketry</Link></h1>
                <p>Meets Tuesday at 5:33 pm, in Busby Room 230</p>
                <br />
                <div>
                    <img src="/images/home1.jpg" className="d-block img-fluid rounded mx-auto cimg" alt="TREX 2023" />
                </div>
                <br />
            </div>

            {/* Nav */}
            <nav id="nav">
                <ul>
                    <li className={location.pathname === '/' ? 'current' : ''}>
                        <Link to="/">Home</Link>
                    </li>
                    {/* <li><Link to="/documentation">Documentation</Link></li> */}
                    {/* <li><Link to="/about">About</Link></li> */}
                    <li className={location.pathname === '/calendar' ? 'current' : ''}>
                        <Link to="/calendar">Schedule</Link>
                    </li>
                </ul>
            </nav>
        </section>
    );
};

export default Header;
