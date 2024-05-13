import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Form } from "react-bootstrap";

const GroupTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/groups");
        setGroups(response.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupChange = async (e) => {
    const groupID = e.target.value;
    setSelectedGroup(groupID);
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/transactions/groupwise/${groupID}`
      );
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching group transactions:", error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-3">
      <h1 style={{ color: "#0f0e17" }}>Group Transactions</h1>
      <Form.Select
        onChange={handleGroupChange}
        value={selectedGroup}
        style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option
            key={group._id}
            value={group._id}
            style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
          >
            {group.Group_Name}
          </option>
        ))}
      </Form.Select>
      {selectedGroup && (
        <>
          <br />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Transaction Type</th>
                  <th>Date</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.title}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>
                      {transaction.user.name} ({transaction.user.email})
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
};

export default GroupTransaction;
