import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
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
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "upcoming-placements"), // <-- Firestore collection name
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlacements(data);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const openPdf = (url) => {
    // Open in new tab
    window.open(url, "_blank");
  };

  const openModal = (url) => {
    setModalUrl(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalUrl("");
  };

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
            <Col md={6} lg={4} key={placement.id} className="mb-4">
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
                        {new Date(placement.timestamp.seconds * 1000).toLocaleString()}
                      </p>
                    )}
                    <a
                      href={placement.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary mt-2"
                    >
                      📄 View PDF
                    </a>
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
