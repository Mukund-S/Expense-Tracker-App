import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../components/Spinner";
import "react-datepicker/dist/react-datepicker.css";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
  createGroup,
  getGroup,
  joinGroup,
  userGroup,
  deleteGroup,
} from "../../../utils/ApiRequest";
import axios from "axios";

const UserGroup = ({ cUser }) => {
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

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupnam, setgroupnam] = useState("");
  const [availableGroups, setAvailableGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [joinedGroup, setJoinedGroup] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [isFetch, setIsFetch] = useState(false);

  const handleShowCreateGroupModal = () => setShowCreateGroupModal(true);
  const handleCloseCreateGroupModal = () => setShowCreateGroupModal(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchJoinedGroups();
  }, []);

  const fetchJoinedGroups = async () => {
    try {
      const response = await axios.post(userGroup, {
        userId: cUser._id,
      });
      if (response) {
        const groups = response.data.groups.map((group) => ({
          id: group._id,
          name: group.Group_Name,
        }));
        setJoinedGroups(groups);
      } else {
        console.error("Failed to fetch joined groups:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching joined groups:", error);
    }
  };

  useEffect(() => {
    fetchAvailableGroups();
    fetchJoinedGroups();
    setIsFetch(false);
  }, [cUser, isFetch]);

  const fetchAvailableGroups = async () => {
    try {
      const response = await axios.get(getGroup);
      if (response) {
        const groups = response.data.groups.map((group) => ({
          id: group._id,
          name: group.Group_Name,
        }));
        setAvailableGroups(groups);
      } else {
        console.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(createGroup, {
        Group_Name: groupnam,
        user: cUser._id,
      });
      if (response.data.success) {
        console.log("Group created successfully:", response.data.group);
        setShowCreateGroupModal(false);
        setIsFetch(true);
      } else {
        console.error("Failed to create group:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      if (!selectedGroup) {
        toast.error("Please select a group to join", toastOptions);
        return;
      }
      const response = await axios.post(joinGroup, {
        Group_Name: selectedGroup,
        userId: cUser._id,
      });

      if (response) {
        console.log("Joined group:", selectedGroup);
        toast.success(
          `Successfully joined group: ${selectedGroup}`,
          toastOptions
        );
        setShowJoinGroupModal(false);
        setIsFetch(true);
      } else {
        console.error("Failed to join group:", selectedGroup);
        toast.error(`Failed to join group: ${selectedGroup}`, toastOptions);
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("An error occurred while joining the group", toastOptions);
    }
  };

  const handleGroupName = (name) => {
    setgroupnam(name);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await axios.delete(deleteGroup + `${groupId}`);
      console.log(`Deleted Id: ${groupId}`);
      setIsFetch(true);
      toast.info("Group Deleted");
    } catch (error) {
      console.error(`Error deleting group ${groupId}:`, error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          <ToastContainer />
          <div className="joinedGroups" style={{ color: "#0f0e17" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Joined Groups</h3>
              <div>
                <Button
                  onClick={handleShowCreateGroupModal}
                  className="addGroup"
                  style={{
                    backgroundColor: "#ff8906",
                    borderColor: "#ff8906",
                    color: "#fffffe",
                    marginRight: "10px",
                  }}
                >
                  Create Group
                </Button>
                <Button
                  onClick={() => setShowJoinGroupModal(true)}
                  className="joinGroup"
                  style={{
                    backgroundColor: "#ff8906",
                    borderColor: "#ff8906",
                    color: "#fffffe",
                  }}
                >
                  Join Group
                </Button>
              </div>
            </div>

            <table className="table" style={{ marginTop: "15px" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Group Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {joinedGroups.map((group, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{group.name}</td>
                    <td>
                      <DeleteForeverIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        key={group.id}
                        id={group.id}
                        onClick={() => handleDeleteGroup(group.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      )}
      {/* Modal for Creating Group */}
      <Modal
        show={showCreateGroupModal}
        onHide={handleCloseCreateGroupModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Group Name"
                value={groupnam}
                onChange={(e) => handleGroupName(e.target.value)}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCreateGroupModal}
            style={{ backgroundColor: "#f25f4c", borderColor: "#f25f4c" }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateGroup}
            style={{ backgroundColor: "#ff8906", borderColor: "#ff8906" }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Model for Join Group */}
      <Modal
        show={showJoinGroupModal}
        onHide={() => setShowJoinGroupModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Join Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSelectGroup">
              <Form.Label>Select Group</Form.Label>
              <Form.Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                style={{ backgroundColor: "#fffffe", color: "#0f0e17" }}
              >
                <option value="">Choose...</option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowJoinGroupModal(false)}
            style={{ backgroundColor: "#f25f4c", borderColor: "#f25f4c" }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleJoinGroup}
            style={{ backgroundColor: "#ff8906", borderColor: "#ff8906" }}
          >
            Join
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserGroup;
