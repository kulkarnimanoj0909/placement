import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Spinner,
  ProgressBar,
  Alert,
  Dropdown
} from "react-bootstrap";
import { motion } from "framer-motion";
import { db, storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import "./Admin.css";

const Admin = () => {
  // State
  const [placedStudents, setPlacedStudents] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch placed students on mount
  useEffect(() => {
    const fetchPlacedStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "placed-students"));
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlacedStudents(students);
      } catch (err) {
        console.error("Error fetching placed students:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlacedStudents();
  }, []);

  // Validate file type
  const isValidFileType = (file) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    return file && allowed.includes(file.type);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (isValidFileType(file)) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("Please select a valid PDF/DOC/DOCX file.");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !companyDescription.trim() || !selectedFile) {
      setError("All fields and a valid file are required.");
      return;
    }
    setError("");
    setIsUploading(true);
    setUploadProgress(0);

    const fileRef = ref(storage, `upcoming-placements/${Date.now()}_${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, selectedFile);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      err => {
        console.error(err);
        setError(`Upload failed: ${err.message}`);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "upcoming-placements"), {
            companyName,
            description: companyDescription,
            fileName: selectedFile.name,
            fileURL: downloadURL,
            timestamp: serverTimestamp()
          });
          setUploadSuccess(true);
          setCompanyName("");
          setCompanyDescription("");
          setSelectedFile(null);
          setTimeout(() => setUploadSuccess(false), 4000);
        } catch (dbErr) {
          console.error(dbErr);
          setError(`Error saving to Firestore: ${dbErr.message}`);
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Loading TPO Panel...</p>
      </div>
    );
  }

  return (
    <Container fluid className="admin-container p-0">
      <motion.div
        className="tpo-header p-3 d-flex justify-content-between align-items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Welcome to TPO Panel</h3>
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            Admin
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/profile">My Profile</Dropdown.Item>
            <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </motion.div>

      <Row className="m-0">
        <Col md={6} className="p-3">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-people-fill me-2"></i>Manage Students
              </Card.Title>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>List of Placed Students</Card.Title>
              <div className="table-container">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Company</th>
                      <th>Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placedStudents.map((student, idx) => (
                      <tr key={student.id}>
                        <td>{idx + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.course}</td>
                        <td>{student.company}</td>
                        <td>{student.package}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="p-3">
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-briefcase-fill me-2"></i>Upload Placement Opportunity
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Company Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={companyDescription}
                    onChange={e => setCompanyDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <div
                  className="file-upload mt-3"
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleFileChange}
                >
                  <input
                    type="file"
                    id="file-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    hidden
                  />
                  <Button variant="secondary" onClick={() => document.getElementById('file-input').click()}>
                    <i className="bi bi-upload me-2"></i>
                    {selectedFile ? selectedFile.name : 'Upload File'}
                  </Button>
                  <p className="text-muted mt-2">Click or drag & drop a PDF/DOC/DOCX file</p>
                </div>

                {isUploading && (
                  <div className="mt-3">
                    <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                  </div>
                )}

                <Button type="submit" className="mt-4" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Add Placement'}
                </Button>

                {uploadSuccess && <Alert variant="success" className="mt-3">✅ Placement uploaded successfully!</Alert>}
                {error && <Alert variant="danger" className="mt-3">⚠️ {error}</Alert>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
