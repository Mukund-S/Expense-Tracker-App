import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const Currency = () => {
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/location");
      const currenciesData = response.data.locations.map((location) => ({
        id: location._id,
        country: location.country,
        currency: location.currency,
      }));
      setCurrencies(currenciesData);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const fetchTransactionsByCurrency = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/transactions/${currency}`
      );
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions by currency:", error);
      setLoading(false);
    }
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    if (currency) {
      fetchTransactionsByCurrency();
    } else {
      // Clear transactions when no currency is selected
      setTransactions([]);
    }
  }, [currency]);

  return (
    <Container className="mt-3">
      <h1>Transactions by Currency</h1>
      <div>
        <select
          name="currency"
          value={currency}
          onChange={handleCurrencyChange}
        >
          <option value="">Select Currency</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.currency}>
              {currency.currency}
            </option>
          ))}
        </select>
      </div>
      {currency && // Render table only if currency is selected
        (loading ? (
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
                  <td>{transaction.userName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ))}
    </Container>
  );
};

export default Currency;
