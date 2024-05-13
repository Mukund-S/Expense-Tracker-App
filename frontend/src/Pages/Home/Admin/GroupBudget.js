import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Table, DropdownButton, Dropdown } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GroupBudget = () => {
  const canvasRef = useRef(null);

  const [groupBudget, setGroupBudget] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/groups");
        setGroups(response.data.groups);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupSelect = async (groupId) => {
    setSelectedGroup(groupId);
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/groups/budget/${groupId}`
      );
      setGroupBudget(response.data.groupBudget);
      setSelectedGroupName(response.data.groupName);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching group budget:", error);
      setLoading(false);
    }
  };

  const data = {
    labels: ["Grocery", "Utility", "Food"],
    datasets: [
      {
        label: "Amount",
        data: [
          groupBudget.totalGrocery || 0,
          groupBudget.totalUtility || 0,
          groupBudget.totalFood || 0,
        ],
        backgroundColor: ["#eb2f06", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#eb2f06", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="container mt-3">
      <h1>Group Budget</h1>
      <DropdownButton
        id="dropdown-basic-button"
        title={selectedGroup ? `${selectedGroupName}` : "Select Group"}
      >
        {groups.map((group) => (
          <Dropdown.Item
            key={group._id}
            onClick={() => handleGroupSelect(group._id)}
          >
            {group.Group_Name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      {selectedGroup &&
        groupBudget.totalGrocery &&
        groupBudget.totalUtility &&
        groupBudget.totalFood && (
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Grocery</td>
                  <td>{groupBudget.totalGrocery}</td>
                </tr>
                <tr>
                  <td>Utility</td>
                  <td>{groupBudget.totalUtility}</td>
                </tr>
                <tr>
                  <td>Food</td>
                  <td>{groupBudget.totalFood}</td>
                </tr>
              </tbody>
            </Table>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "500px" }}>
                <Pie data={data} />
              </div>
            </div>
          </div>
        )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default GroupBudget;
