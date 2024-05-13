import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../components/Spinner";
import TableData from "../TableData";

import "react-datepicker/dist/react-datepicker.css";

import {
  getTransactions,
  addTransaction,
  userGroup,
} from "../../../utils/ApiRequest";
import axios from "axios";

const Transaction = ({ cUser, toastOptions }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [choicegrp, setchoicegrp] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmit, setisSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
    transgroup: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "choicegrp") {
      setchoicegrp(e.target.value);
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency,
          startDate,
          endDate,
          type,
          groupId: choicegrp,
        });
        setTransactions(data.transactions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      }
    };

    fetchAllTransactions();
    setisSubmit(false);
    isDelete && setIsDelete(!isDelete);
    setIsEdit(false);
  }, [type, isSubmit, isEdit, isDelete, choicegrp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      amount,
      description,
      category,
      date,
      transactionType,
      transgroup,
    } = values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType ||
      !transgroup
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(addTransaction, {
        title,
        amount,
        description,
        category,
        date,
        transactionType,
        userId: cUser._id,
        group: transgroup,
      });

      if (data.success) {
        toast.success(data.message, toastOptions);
        handleClose();
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction", toastOptions);
    }
    setisSubmit(true);
    setLoading(false);
  };

  useEffect(() => {
    fetchJoinedGroups();
  }, []);

  const fetchJoinedGroups = async () => {
    try {
      console.log(cUser._id);
      const response = await axios.post(userGroup, {
        userId: cUser._id,
      });
      if (response) {
        setJoinedGroups(response.data.groups);
      } else {
        console.error("Failed to fetch joined groups:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching joined groups:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          <div className="text-black type d-flex justify-content-between align-items-center">
            {/* Form Groups */}
            <div className="d-flex">
              <Form.Group className="mb-3 me-3" controlId="formSelectFrequency">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={type}
                  onChange={handleSetType}
                  style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
                >
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Credit</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Choose Group</Form.Label>
                <Form.Select
                  name="choicegrp"
                  value={choicegrp}
                  onChange={handleChange}
                  style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
                >
                  <option value="">Choose...</option>
                  {joinedGroups.map((choicegrp) => (
                    <option key={choicegrp._id} value={choicegrp._id}>
                      {choicegrp.Group_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="d-flex">
              <Button
                onClick={handleShow}
                className="addNew"
                style={{
                  marginRight: "10px",
                  backgroundColor: "#ff8906",
                  borderColor: "#ff8906",
                  color: "#fffffe",
                }}
              >
                Add New
              </Button>
              <Button
                onClick={handleShow}
                className="mobileBtn"
                style={{
                  backgroundColor: "#ff8906",
                  borderColor: "#ff8906",
                  color: "#fffffe",
                }}
              >
                +
              </Button>
            </div>
          </div>

          <TableData
            data={transactions}
            user={cUser}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isDelete={isDelete}
            setIsDelete={setIsDelete}
            groups={joinedGroups}
          />
        </Container>
      )}
      {/* Modal for Adding New Transaction */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                placeholder="Enter Transaction Name"
                value={values.title}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                placeholder="Enter your Amount"
                value={values.amount}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelect">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={values.category}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              >
                <option value="">Choose...</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter Description"
                value={values.description}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelect1">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              >
                <option value="">Choose...</option>
                <option value="credit">Credit</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelect1">
              <Form.Label>Choose Group</Form.Label>
              <Form.Select
                name="transgroup"
                value={values.transgroup}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              >
                <option value="">Choose...</option>
                {joinedGroups.map((transgroup) => (
                  <option key={transgroup._id} value={transgroup._id}>
                    {transgroup.Group_Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              />
            </Form.Group>

            <Button
              variant="secondary"
              onClick={handleClose}
              style={{ backgroundColor: "#f25f4c", borderColor: "#f25f4c" }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{ backgroundColor: "#ff8906", borderColor: "#ff8906" }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Transaction;
