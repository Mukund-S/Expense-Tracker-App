import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

const ExpenseVsCredit = ({ cUser }) => {
  const [loading, setLoading] = useState(false);
  const [expenseVsCreditData, setExpenseVsCreditData] = useState(null);

  useEffect(() => {
    fetchExpenseVsCreditData();
  }, []);

  const fetchExpenseVsCreditData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/total-expenses-credits",
        {
          userId: cUser._id,
        }
      );
      const { totalExpenses, totalCredits } = response.data;
      setExpenseVsCreditData({
        labels: ["Expenses", "Credits"],
        datasets: [
          {
            label: "Amount",
            data: [totalExpenses, totalCredits],
            backgroundColor: ["#0f0e17", "#ff8906"],
            hoverOffset: 4,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expense vs credit data:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <h2>Expense vs Credit</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          expenseVsCreditData && (
            <div
              style={{
                width: "50%",
                height: "50%",
                marginLeft: "25%",
              }}
            >
              <Doughnut
                data={expenseVsCreditData}
                options={{
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Expense vs Credit",
                    },
                  },
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ExpenseVsCredit;
