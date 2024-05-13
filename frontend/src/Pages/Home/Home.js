import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";

import "react-datepicker/dist/react-datepicker.css";

import Navbar from "./Navbar";
import Transaction from "./User/Transaction";
import UserGroup from "./User/UserGroup";
import Budget from "./User/Budget";
import Feedback from "./User/Feedback";
import Visual from "./User/ExpenseVsCredit";
import GroupTransaction from "./Admin/GroupTransaction";
import GroupBudget from "./Admin/GroupBudget";
import ExceedingBudget from "./Admin/ExceedingBudget";
import Currency from "./Admin/Currency";
import UsersPage from "./Admin/UsersPage";
import FeedbackPage from "./Admin/FeedbackPage";

const Home = ({}) => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const [cUser, setcUser] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const locationMapping = {
    Transactions: (
      <Transaction
        cUser={cUser}
        setcUser={setcUser}
        handleClose={handleClose}
        handleShow={handleShow}
        toastOptions={toastOptions}
      />
    ),
    Budget: (
      <Budget
        cUser={cUser}
        setcUser={setcUser}
        handleClose={handleClose}
        handleShow={handleShow}
        toastOptions={toastOptions}
      />
    ),
    UserGroup: (
      <UserGroup
        cUser={cUser}
        setcUser={setcUser}
        handleClose={handleClose}
        handleShow={handleShow}
        toastOptions={toastOptions}
      />
    ),
    Feedback: (
      <Feedback
        cUser={cUser}
        setcUser={setcUser}
        handleClose={handleClose}
        handleShow={handleShow}
        toastOptions={toastOptions}
      />
    ),
    Visual: <Visual cUser={cUser} />,
    GroupTransaction: <GroupTransaction />,
    GroupBudget: <GroupBudget />,
    ExceedingBudget: <ExceedingBudget />,
    Currency: <Currency />,
    UsersPage: <UsersPage />,
    FeedbackPage: <FeedbackPage />,
    null: <h1> empty </h1>,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }
        setcUser(user);
        console.log(cUser);
        setRefresh(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <div
          className="container mt-2"
          style={{
            height: "100vh",
            width: "80%",
            backgroundImage: `url('../assets/currency.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {locationMapping[currentPage] != null ? (
            <div>{locationMapping[currentPage]}</div>
          ) : (
            <div
              className="container mt-2"
              style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h1
                  style={{
                    color: "black",
                    fontSize: "3rem",
                    marginBottom: "1rem",
                  }}
                >
                  Welcome to
                  <span style={{ color: "#ff8906" }}> Expense</span>
                  <span style={{ color: "#0f0e17" }}> Management</span>
                </h1>
                <p style={{ color: "#a7a9be", fontSize: "1.2rem" }}>
                  Take control of your expenses with our intuitive management
                  system.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
