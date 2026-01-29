import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Header />
            <div id="page-wrapper">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default Layout;
