import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/feedback");
      setFeedbackData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-3">
      <h1>User Feedback</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((feedback) => (
              <tr key={feedback._id}>
                <td>{feedback.user_id.name}</td>
                <td>{feedback.user_id.email}</td>
                <td>{feedback.review}</td>
                <td>{feedback.rating}</td>
                <td>{new Date(feedback.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default FeedbackPage;
