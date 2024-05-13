import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  const navigate = useNavigate();

  const handleNavItemClick = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid justify-content-between">
        <div>
          <ul className="navbar-nav">
            {currentUser === "Admin" ? (
              <>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "GroupTransaction" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("GroupTransaction")}
                  >
                    Group Transaction
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "GroupBudget" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("GroupBudget")}
                  >
                    Group Budget
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "ExceedingBudget" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("ExceedingBudget")}
                  >
                    Exceeding Budget
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "Currency" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("Currency")}
                  >
                    Currency
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "UsersPage" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("UsersPage")}
                  >
                    Users
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "FeedbackPage" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("FeedbackPage")}
                  >
                    Feedback
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "Transactions" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("Transactions")}
                  >
                    Transactions
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "Budget" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("Budget")}
                  >
                    Budget
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "UserGroup" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("UserGroup")}
                  >
                    Group
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "Feedback" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("Feedback")}
                  >
                    Feedback
                  </button>
                </li>
                <li className={"nav-item"}>
                  <button
                    className={`nav-link ${
                      currentPage === "Visual" ? "active" : ""
                    }`}
                    onClick={() => handleNavItemClick("Visual")}
                  >
                    Visual
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
