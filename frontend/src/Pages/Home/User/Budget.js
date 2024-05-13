import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { getBudget, createBudget } from "../../../utils/ApiRequest";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Budget = ({ cUser, toastOptions }) => {
  const [usrbudget, setBudgets] = useState([]);
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetBudget, setIsSetBudget] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [amounts, setAmounts] = useState({
    Grocery: "",
    Utility: "",
    Food: "",
  });

  useEffect(() => {
    fetchBudgets();
    setIsSetBudget(false);
    setIsDelete(false);
  }, [isSetBudget, isDelete]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.post(getBudget, {
        userId: cUser._id,
      });
      console.log(response.data.budget);
      setBudgets(response.data.budget);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching usrbudget:", error);
      setLoading(false);
    }
  };

  const handleSetBudget = async () => {
    try {
      console.log(amount);
      // Send request to set budget for all categories at once
      const response = await axios.post(createBudget, {
        userId: cUser._id,
        Grocery: amount.grocery,
        Utility: amount.utility,
        Food: amount.food,
      });
      setShowSetBudgetModal(false);
      setIsSetBudget(true);
      setAmount({
        Grocery: "",
        Utility: "",
        Food: "",
      });
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      const response = await axios.delete(createBudget + `/${budgetId}`);
      console.log("Deleted budget:", response.data);
      setIsDelete(true);
      toast.info("Budget Deleted");
      setBudgets([]);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container>
          <ToastContainer />
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Budgets</h3>
              <Button
                onClick={() => setShowSetBudgetModal(true)}
                style={{
                  backgroundColor: "#ff8906",
                  borderColor: "#ff8906",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                Set Budget
              </Button>
            </div>

            {loading ? (
              <p>Loading budgets...</p>
            ) : (
              <>
                {usrbudget._id && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Groceries</th>
                        <th>Utilities</th>
                        <th>Food</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={usrbudget._id}>
                        <td>{usrbudget.Grocery}</td>
                        <td>{usrbudget.Utility}</td>
                        <td>{usrbudget.Food}</td>
                        <td>
                          <DeleteForeverIcon
                            sx={{ color: "red", cursor: "pointer" }}
                            key={usrbudget._id}
                            id={usrbudget._id}
                            onClick={() => handleDeleteBudget(usrbudget._id)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
          <Modal
            show={showSetBudgetModal}
            onHide={() => setShowSetBudgetModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Set Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formBudgetAmount">
                  <Form.Label>Grocery</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount.grocery} // Use amount.grocery to bind the value
                    onChange={(e) =>
                      setAmount({ ...amount, grocery: e.target.value })
                    }
                  />
                  <Form.Label>Utility</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount.utility} // Use amount.utility to bind the value
                    onChange={(e) =>
                      setAmount({ ...amount, utility: e.target.value })
                    }
                  />
                  <Form.Label>Food</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount.food} // Use amount.food to bind the value
                    onChange={(e) =>
                      setAmount({ ...amount, food: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSetBudgetModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSetBudget}>
                Set
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default Budget;
