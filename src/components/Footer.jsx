import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <section id="footer" className="wrapper">
            <div className="title">Contact</div>
            <div className="container">
                <header className="style1">
                    <h2>Want to reach out to us?</h2>
                    <p>
                        The best way to reach out is to contact us through the{' '}
                        <a href="https://uwplatt.campuslabs.com/engage/organization/pioneerrocketry/contact">
                            Contact Link
                        </a>
                        .
                    </p>
                </header>
                <div className="row">
                    <div className="col-12 col-12-medium">
                        {/* Contact */}
                        <section className="feature-list small">
                            <div className="row">
                                <div className="col-4 col-12-small">
                                    <section>
                                        <h3 className="icon solid fa-home">Mailing Address</h3>
                                        <p>
                                            Pioneer Rocketry Club<br />
                                            Pioneer Involvement Center<br />
                                            1 University Plaza<br />
                                            Platteville, WI 53818<br />
                                            United States
                                        </p>
                                    </section>
                                </div>
                                <div className="col-4 col-12-small" id="social">
                                    <section className="social-section">
                                        <h3>Social</h3>
                                        <ul className="social-list">
                                            <li>
                                                <a href="https://uwplatt.campuslabs.com/engage/organization/pioneerrocketry" className="social-link">
                                                    <img src="/images/favicon.png" alt="Email Icon" className="social-icon" />
                                                    Pioneer Link
                                                </a>
                                            </li>

                                            <li>
                                                <a href="https://www.linkedin.com/company/pioneer-rocketry" className="social-link">
                                                    <img src="/images/linkedIn.png" alt="LinkedIn Icon" className="social-icon" />
                                                    LinkedIn
                                                </a>
                                            </li>

                                            <li>
                                                <a href="https://www.instagram.com/pioneerrocketry" className="social-link">
                                                    <img src="/images/instagram.png" alt="Instagram Icon" className="social-icon" />
                                                    Instagram
                                                </a>
                                            </li>

                                            <li>
                                                <a href="https://www.youtube.com/@PioneerRocketry" className="social-link">
                                                    <img src="/images/youtubeLogo.png" alt="YouTube Icon" className="social-icon" />
                                                    YouTube
                                                </a>
                                            </li>
                                        </ul>
                                    </section>
                                </div>

                                <div className="col-4 col-12-small">
                                    <section style={{ paddingTop: '0px !important', borderTop: '0px !important' }}>
                                        <h3 className="icon solid fa-envelope">Email</h3>
                                        <p>
                                            Club President: <a href="mailto:bazylewiczg@uwplatt.edu">bazylewiczg@uwplatt.edu</a>
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div id="copyright">
                    <ul>
                        <li>&copy; Pioneer Rocketry (2024)</li>
                        <li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Footer;
