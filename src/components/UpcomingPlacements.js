import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Spinner,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { motion } from "framer-motion";
import "./UpcomingPlacements.css";

const UpcomingPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/placements");
        // Sort placements by timestamp descending (if not already sorted on backend)
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPlacements(sorted);
      } catch (error) {
        console.error("Error fetching placements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Fetching placement updates...</p>
      </div>
    );
  }

  return (
    <Container className="upcoming-placements-container py-4">
      <h2 className="mb-4 text-center">Placement Notifications</h2>
      <Row>
        {placements.length === 0 ? (
          <p className="text-center">No new placement messages.</p>
        ) : (
          placements.map((placement, index) => (
            <Col md={6} lg={4} key={placement._id || index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="placement-card shadow-sm">
                  <Card.Body>
                    <Card.Title>{placement.companyName}</Card.Title>
                    <Card.Text>{placement.description}</Card.Text>
                    {placement.timestamp && (
                      <p className="text-muted small">
                        {new Date(placement.timestamp).toLocaleString()}
                      </p>
                    )}
                    {placement.fileURL && (
                      <a
                        href={placement.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mt-2"
                      >
                        📄 View PDF
                      </a>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default UpcomingPlacements;
