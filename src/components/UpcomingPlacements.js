import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, Spinner, Container, Row, Col, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import "./UpcomingPlacements.css";

const UpcomingPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "upcoming-placements"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlacements(data);
      setLoading(false);
    });

    return () => unsubscribe();
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
    <>
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
                          {new Date(
                            placement.timestamp.seconds * 1000
                          ).toLocaleString()}
                        </p>
                      )}
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openPdf(placement.fileURL)}
                        >
                          Open in New Tab
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => openModal(placement.fileURL)}
                        >
                          Preview PDF
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Modal for PDF preview */}
      <Modal show={showModal} onHide={closeModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          <iframe
            src={modalUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpcomingPlacements;
