import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            {/* Intro */}
            <section id="intro" className="wrapper style1 moduleSafe">
                <div className="title">What is Pioneer Rocketry</div>
                <div className="container moduleSafe">
                    <p className="style2">What is Pioneer Rocketry?</p>
                    <p className="style3">
                        Pioneer Rocketry is an organization with a focus on high powered rocketry within University Wisconsin Platteville. The club was created for students of any major or skill level to experience rocketry first hand. The club participates in competitions at the
                        state, national, and international levels. Pioneer Rocketry also hosts and participates in a variety of outreach events geared towards engaging the youth of our community. Back at home, Pioneer Rocketry also keeps its own members engaged. The Team Rocketry
                        Educational eXtravaganza (TREX) is a competition hosted by Pioneer Rocketry at the start of fall semester designed especially for those who are new to rocketry. New members are teamed up with club veterans and taught the basics of high powered rocketry
                        over the course of several weeks while building a rocket with their group. Pioneer Rocketry also helps its members achieve high power certification, providing a build space and tools. During the spring semester, club members will work on their L1 or L2
                        Certification rockets. The club also hosts a variety of events throughout the year, including launch days, build times, and other events. One event that was held in spring 2025 was Gravity Garbage, where club members were tasked with making a rocket of
                        something they could find in the trash. Some of the rockets made were a pringles can rocket, a standing lamp rocket, and a plastic baseball bat rocket. As a club we also participate in two competitions,{' '}
                        <a href="https://www.carthage.edu/live/profiles/2084-collegiate-rocket-competition">CRL (Collegiate Rocket Competition)</a>{' '}
                        and{' '}
                        <a href="https://kloudbusters.org/content.aspx?page_id=22&club_id=325948&module_id=675623">Argonia Cup</a>
                        . CRL is a competition that takes place in the spring and is hosted by the Wisconsin Space Grant Consortium. Argonia Cup is a competition that takes place around the same time as CRL and is hosted by the Kloudbusters Rocketry Club. Each have specific rules
                        that need to be followed to compete.
                    </p>
                    <ul className="actions moduleSafe">
                        <li className="moduleSafe">
                            <a href="https://uwplatt.campuslabs.com/engage/organization/pioneerrocketry" className="button style3 large">Learn More</a>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Certifications */}
            <section id="highlights" className="wrapper style3">
                <div className="title">
                    <a className="text-light" href="https://www.nar.org/high-power-rocketry-certifications/">Rocketry Endorsements</a>
                </div>

                <div className="container">
                    <section>
                        <header className="style1">
                            <h2>What certifications are available to me?</h2>
                            <p>Currently we offer the ability to aquire Level 1 and Level 2 High Power Rockety certifications. L3 Certifications can be completed outside of the club with club assistance.</p>
                            <p style={{ fontSize: 'xx-small' }}><small>(Must be a student enrolled at UWP)</small></p>
                        </header>
                    </section>
                    <div className="certifications-grid">
                        <div className="cert-item">
                            <section className="highlight cert-section">
                                <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=HPRCertifications%40nar.org.-,HPR%20Level%201%20Certification,-HPR%20Level%201" className="image featured cert-image">
                                    <img src="/images/l1.jpg" alt="Level 1 Certification" />
                                </a>
                                <div className="cert-content">
                                    <h3 className="cert-title">
                                        <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=HPRCertifications%40nar.org.-,HPR%20Level%201%20Certification,-HPR%20Level%201">Level 1</a>
                                    </h3>
                                    <p className="cert-desc">While in the presence of either 2 L1 certified members or 1 L2 certified member, successfully launch and recover a rocket using a motor in the G, H, or I impulse range.</p>
                                </div>
                                <ul className="actions cert-actions">
                                    <li>
                                        <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=HPRCertifications%40nar.org.-,HPR%20Level%201%20Certification,-HPR%20Level%201" className="button style1">Learn More</a>
                                    </li>
                                </ul>
                            </section>
                        </div>
                        <div className="cert-item">
                            <section className="highlight cert-section">
                                <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=1%20Certification%20Form-,HPR%20Level%202%20Certification,-HPR%C2%A0Level" className="image featured cert-image">
                                    <img src="/images/l2.jpg" alt="Level 2 Certification" />
                                </a>
                                <div className="cert-content">
                                    <h3 className="cert-title">
                                        <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=1%20Certification%20Form-,HPR%20Level%202%20Certification,-HPR%C2%A0Level">Level 2</a>
                                    </h3>
                                    <p className="cert-desc">After aquiring Level 1 cert, pass a written test covering high-power rocketry principles, and then successfully launch and recover a rocket using a motor in the J, K, or L impulse range.</p>
                                </div>
                                <ul className="actions cert-actions">
                                    <li><a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=1%20Certification%20Form-,HPR%20Level%202%20Certification,-HPR%C2%A0Level" className="button style1">Learn More</a></li>
                                </ul>
                            </section>
                        </div>
                        <div className="cert-item">
                            <section className="highlight cert-section">
                                <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=D%20%2D%20Rocket%20Stability-,HPR%20Level%203%20Certification,-HPR%20Level%203" className="image featured cert-image">
                                    <img src="/images/l3.jpg" alt="Level 3 Certification" />
                                </a>
                                <div className="cert-content">
                                    <h3 className="cert-title">
                                        <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=D%20%2D%20Rocket%20Stability-,HPR%20Level%203%20Certification,-HPR%20Level%203">Level 3</a>
                                    </h3>
                                    <p className="cert-desc">With Level 2 certification, submit a detailed flight plan and design to a certification committee for approval, then successfully launch and recover a complex rocket with a motor in the M to O impulse range.</p>
                                </div>
                                <ul className="actions cert-actions">
                                    <li>
                                        <a href="https://www.nar.org/content.aspx?page_id=22&club_id=114127&module_id=668315#:~:text=D%20%2D%20Rocket%20Stability-,HPR%20Level%203%20Certification,-HPR%20Level%203" className="button style1">Learn More</a>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            {/* College Rocketry */}
            <section id="main" className="wrapper style2 d-none">
                <div className="title">Our Offerings</div>
                <div className="container">
                    {/* Image */}
                    <a href="#" className="image small img-fluid">
                        <img src="/images/collegepr.jpg" alt="" />
                    </a>

                    {/* Features */}
                    <section id="features">
                        <header className="style1">
                            <h2>College Rocketry Programs</h2>
                            <p>The study of rocketry is an interdisciplinary field that integrates principles from materials science, aerodynamics, propulsion, and computer simulations, offering students hands-on experience in designing and launching rockets.</p>
                        </header>
                        <div className="feature-list">
                            <div className="row">
                                <div className="col-6 col-12-medium">
                                    <section>
                                        <h3 className="icon">Aerospace Engineering in College</h3>
                                        <p>
                                            Many universities offer specialized programs in aerospace engineering, focusing on the design, construction, and testing of rockets, satellites, and other spacecraft. These programs often include student-led rocketry teams that compete
                                            in national competitions.
                                        </p>
                                    </section>
                                </div>
                                <div className="col-6 col-12-medium">
                                    <section>
                                        <h3 className="icon solid">Historical Milestones</h3>
                                        <p>Robert Goddard, the father of modern rocketry, launched the world's first liquid-fueled rocket in 1926, paving the way for modern space exploration.</p>
                                    </section>
                                </div>
                                {/* ... other features ... */}
                            </div>
                        </div>
                        <ul className="actions special">
                            <li><a href="https://uwplatt.campuslabs.com/engage/organization/pioneerrocketry" className="button style1 large">Join the Mission!</a></li>
                        </ul>
                    </section>
                </div>
            </section>

            {/* Sponsors */}
            <section id="sponsors" className="wrapper style2">
                <div className="title">Our Sponsors</div>
                <div className="container">

                    <div className="row aln-center" style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
                        {/* Onshape */}
                        <div className="col-6 col-12-medium card-like" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <section className="highlight" style={{ textAlign: 'center' }}>
                                <div className="" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <a href="https://www.onshape.com/en/" className="image featured" style={{ display: 'flex', minHeight: '400px' }}>
                                        <img src="/images/onshape-logo-RGB_color.svg" alt="Onshape Logo" style={{ maxWidth: '500px', height: 'auto', display: 'block', margin: '0 auto' }} />
                                    </a>
                                    <h3>
                                        <a href="https://www.onshape.com/en/">Onshape</a>
                                    </h3>
                                    <p style={{ maxHeight: '400px', minHeight: '300px' }}>
                                        Onshape is a computer-aided design (CAD) software system, delivered over the Internet via a software as a service (SaaS) model. It makes extensive use of cloud computing, with compute-intensive processing and rendering performed on
                                        Internet-based servers, and users are able to interact with the system via a web browser or the iOS and Android apps. As a SaaS system, Onshape upgrades are released directly to the web interface, and the software does not require
                                        maintenance by the user.
                                        <small>
                                            - <a href="https://en.wikipedia.org/wiki/Onshape">Wikipedia</a>
                                        </small>
                                    </p>
                                </div>
                                <ul className="actions" style={{ marginTop: 'auto' }}>
                                    <li><a href="https://www.onshape.com/en/" className="button style1">Visit Onshape</a></li>
                                </ul>
                            </section>
                        </div>

                        {/* Wisconsin Space Grant Consortium */}
                        <div className="col-6 col-12-medium card-like" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <section className="highlight" style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <a href="https://spacegrant.carthage.edu/" className="image featured" style={{ display: 'flex', minHeight: '400px' }}>
                                        <img src="/images/wsgc-logo.png" alt="WSGC Logo" style={{ objectFit: 'contain', maxWidth: '400px', height: 'auto', display: 'block', margin: '0 auto' }} />
                                    </a>
                                    <h3>
                                        <a href="https://spacegrant.carthage.edu/">Wisconsin Space Grant Consortium</a>
                                    </h3>
                                    <p style={{ maxHeight: '400px', minHeight: '300px' }}>
                                        The Wisconsin Space Grant Consortium is a member institution of the national network of Space Grant Consortia funded by NASA's National Space Grant College and Fellowship Program. Congress established the program in 1988 to contribute to
                                        the nation's scientific enterprise by funding research, education, and public service projects through a national network of 52 university-based Space Grant consortia.
                                        <small>
                                            - <a href="https://spacegrant.carthage.edu/about/">WSGC</a>
                                        </small>
                                    </p>
                                </div>
                                <ul className="actions" style={{ marginTop: 'auto' }}>
                                    <li><a href="https://spacegrant.carthage.edu/" className="button style1">Visit WSGC</a></li>
                                </ul>
                            </section>
                        </div>

                        {/* CMG and Associates */}
                        <div className="col-6 col-12-medium card-like" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <section className="highlight" style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <a href="http://cmgengineers.com/" className="image featured" style={{ display: 'flex', minHeight: '400px' }}>
                                        <img src="/images/CMG_Color.png" alt="CMG Engineers" style={{ objectFit: 'contain', maxWidth: '400px', height: 'auto', display: 'block', margin: '0 auto' }} />
                                    </a>
                                    <h3><a href="http://cmgengineers.com/">CMG & Associates, Inc</a></h3>
                                    <p style={{ maxHeight: '400px', minHeight: '300px' }}>
                                        CMG &amp; Associates, Inc. is a consulting engineering firm specializing in the design of mechanical, electrical, plumbing, and fire protection systems. CMG is a woman-owned business that incorporates sustainability into every project. In
                                        addition to design, the firm provides engineering studies, peer review, facility assessment, and energy audits. Their efforts in commissioning and retro-commissioning give owners confidence in the performance of their building systems.
                                        <small>
                                            - <a href="http://www.cmgengineers.com/page8.html">CMG &amp; Associates</a>
                                        </small>
                                    </p>
                                </div>
                                <ul className="actions" style={{ marginTop: 'auto' }}>
                                    <li><a href="http://cmgengineers.com/page11.html" className="button style1">Visit CMG &amp; Associates</a></li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
