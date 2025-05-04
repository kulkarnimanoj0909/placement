import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button, Navbar, Nav, Row, Col, Card } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Landing.css";

const Landing = () => {
    const navigate = useNavigate();

    // Placement Data for Graphs
    const years = ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24"];
    const companiesVisited = [96, 131, 129, 105, 65];
    const offersMade = [538, 591, 1120, 685, 431];
    const avgPackages = [4.87, 5.06, 5.52, 5.90, 6.59];
    const highestPackages = [62, 40, 23.4, 41, 43.94];

    // Graph Data
    const placementStats = {
        labels: years,
        datasets: [
            { label: "Companies Visited", data: companiesVisited, backgroundColor: "#2E93fA" },
            { label: "Offers Made", data: offersMade, backgroundColor: "#66DA26" },
        ],
    };

    const packageStats = {
        labels: years,
        datasets: [
            { label: "Average Package (LPA)", data: avgPackages, borderColor: "#546E7A", fill: false },
            { label: "Highest Package (LPA)", data: highestPackages, borderColor: "#D7263D", fill: false },
        ],
    };

    return (
        <>
            {/* Navbar */}
            <Navbar className="glass-navbar" expand="lg">
                <Container>
                    <Navbar.Brand className="brand-text">🚀 Placement Predictor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                        <Nav.Link href="#about">About us</Nav.Link>
                        <Nav.Link href="#stats">Stats</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                            <Button className="login-btn" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <div className="hero-section">
                <Container className="text-center">
                    <motion.h1 className="hero-title" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        Predict Your Placement Probability
                    </motion.h1>
                    <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                        Check your eligibility & required skills for top companies.
                    </motion.p>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <Button className="start-btn" onClick={() => navigate("/login")}>
                            Get Started 🚀
                        </Button>
                    </motion.div>
                </Container>
            </div>

            {/* About Section */}
            <Container className="about-section" id="about">
                <h2 className="section-title">About Us</h2>
                <p className="about-text">
                    Placement Predictor is an innovative platform designed to help students assess their placement readiness.
                    By analyzing their skill set and comparing it with industry requirements, our platform guides students
                    towards a successful career.
                </p>
            </Container>

            {/* Recruiters Section */}
            <Container className="recruiters-section mt-5">
                <h2 className="section-title">Our Recruiters</h2>
                <div className="marquee-container">
                    <marquee behavior="scroll" direction="left">
                        <img src="/images/google.jpg" alt="Google" />
                        <img src="/images/microsoft.jpg" alt="Microsoft" />
                        <img src="/images/amazon.jpg" alt="Amazon" />
                        <img src="/images/benz.jpg" alt="Benz" />
                        <img src="/images/walmart.jpg" alt="Walmart" />
                        <img src="/images/accenture.jpg" alt="Accenture" />
                        <img src="/images/cognizant.jpg" alt="Cognizant" />
                    </marquee>
                </div>
            </Container>

            {/* Placement Stats Section */}
            <Container className="mt-5" id="stats">
                <h2 className="section-title">Placement Statistics</h2>
                <Row>
                    <Col md={6}>
                        <Card className="chart-card">
                            <Bar data={placementStats} />
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="chart-card">
                            <Line data={packageStats} />
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Contact Section */}
            <footer className="footer-section text-center" id="contact">
                <h5>Contact Us</h5>
                <p>Dr. Sunilkumar Honnungar, Placement Officer | Mobile: 8105650888</p>
                <p>Prof. Shrikanth Shirakol, Deputy Placement Officer | Mobile: 9886059174</p>
                <p>Email: sdmcet.taps@gmail.com</p>
            </footer>
        </>
    );
};

export default Landing;
