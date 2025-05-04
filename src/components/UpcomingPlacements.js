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
import { useNavigate } from "react-router-dom"; // <-- Added
import "./UpcomingPlacements.css";

const UpcomingPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Initialize router

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/placements");
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
                      <>
                        <p className="text-muted small mb-1">
                          📅 Posted: {new Date(placement.timestamp).toLocaleString()}
                        </p>
                        <p className="text-danger small">
                          ⏳ Deadline:{" "}
                          {new Date(
                            new Date(placement.timestamp).getTime() +
                            2 * 24 * 60 * 60 * 1000
                          ).toLocaleString()}
                        </p>
                      </>
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

                    <button
                      className="btn btn-success mt-2 ms-2"
                      onClick={() => navigate(`/apply/${placement._id}`)}
                    >
                      📝 Apply Here
                    </button>
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
