import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const ExceedingBudget = () => {
  const [usersExceedingBudget, setUsersExceedingBudget] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExceedingBudget = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/exceedingbudget"
        );
        setUsersExceedingBudget(response.data.usersExceedingBudget);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exceeding budget:", error);
        setLoading(false);
      }
    };

    fetchExceedingBudget();
  }, []);

  return (
    <Container className="mt-3">
      <h1>Users Exceeding Budget</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {usersExceedingBudget.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ExceedingBudget;
