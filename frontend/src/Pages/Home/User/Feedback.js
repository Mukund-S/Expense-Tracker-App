import React, { useState, useEffect } from "react";
import { Container, Button, Modal, Form, Table } from "react-bootstrap";
import axios from "axios";
import Spinner from "../../../components/Spinner";
import { getAllFeedback, usrfeedback } from "../../../utils/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = ({ cUser }) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setSelectedFeedbackId(null);
  };

  const handleShow = () => setShow(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/feedback/${cUser._id}`
      );
      setFeedbacks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleEdit = (feedback) => {
    setFeedback(feedback.review);
    setRating(feedback.rating);
    setSelectedFeedbackId(feedback._id);
    handleShow();
  };

  const handleDelete = async (feedbackId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8000/api/feedback/${feedbackId}`
      );
      console.log("Deleted feedback:", response.data);
      setLoading(false);
      toast.info("Feedback deleted successfully");
      fetchFeedback();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedFeedbackId) {
        response = await axios.put(
          `http://localhost:8000/api/feedback/${selectedFeedbackId}`,
          {
            review: feedback,
            rating: rating,
          }
        );
      } else {
        response = await axios.post(usrfeedback, {
          user_id: cUser._id,
          feedback: feedback,
          rating: rating,
        });
      }
      console.log("Feedback submitted:", response.data);
      setLoading(false);
      setIsSubmit(true);
      setShow(false);
      toast.success(
        selectedFeedbackId
          ? "Feedback updated successfully"
          : "Feedback submitted successfully"
      );
      fetchFeedback();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          <h2>Your Feedback</h2>
          {feedbacks.length === 0 ? (
            <p>No feedback provided yet.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Review</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{feedback.review}</td>
                    <td>{feedback.rating}</td>
                    <td>
                      <Button
                        onClick={() => handleEdit(feedback)}
                        variant="warning"
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        onClick={() => handleDelete(feedback._id)}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Button
            onClick={handleShow}
            style={{ backgroundColor: "#ff8906", borderColor: "#ff8906" }}
          >
            Give Feedback
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedFeedbackId ? "Edit Feedback" : "Give Feedback"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formFeedback">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formRating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  >
                    <option value={0}>Select Rating</option>
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {selectedFeedbackId ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Modal>
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Feedback;
