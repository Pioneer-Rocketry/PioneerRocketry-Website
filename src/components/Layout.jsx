import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const [navPanelVisible, setNavPanelVisible] = React.useState(false);

    // Toggle Nav Panel
    const toggleNavPanel = () => {
        setNavPanelVisible(!navPanelVisible);
    };

    // Close on route change (optional but good practice)
    const location = useLocation();
    React.useEffect(() => {
        setNavPanelVisible(false);
    }, [location]);

    // Update body class
    React.useEffect(() => {
        if (navPanelVisible) {
            document.body.classList.add('navPanel-visible');
        } else {
            document.body.classList.remove('navPanel-visible');
        }
    }, [navPanelVisible]);

    return (
        <>
            <div id="titleBar">
                <a href="#navPanel" className="toggle" onClick={(e) => { e.preventDefault(); toggleNavPanel(); }}></a>
                <span className="title">Pioneer Rocketry</span>
            </div>

            <div id="page-wrapper" style={location.pathname === '/admin' ? { width: '100%', maxWidth: '100%', padding: 0 } : {}}>
                <Header />
                <Outlet />
                {location.pathname !== '/admin' && <Footer />}
            </div>

            <div id="navPanel">
                <nav>
                    <Link className="link depth-0" to="/" onClick={() => setNavPanelVisible(false)} style={{ display: 'block', textIndent: '0' }}>Home</Link>
                    <Link className="link depth-0" to="/calendar" onClick={() => setNavPanelVisible(false)} style={{ display: 'block', textIndent: '0' }}>Schedule</Link>
                </nav>
            </div>
        </>
    );
};

export default Layout;
