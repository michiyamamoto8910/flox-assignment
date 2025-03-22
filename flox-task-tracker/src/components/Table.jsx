import { React, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";

function TaskTable({ tasks, onTaskUpdate }) {
  const [show, setShow] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [currId, setCurrId] = useState(null);
  const handleClose = () => {
    setShow(false);
  };
  const handleConfirm = (task) => {
    const msg = task.completed ? "In Progress" : "Completed";
    setNextStatus(msg);
    setCurrId(task.id);
    setShow(true);
  };
  const handleYes = async () => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${currId}/change`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to assign task status");
      }
      onTaskUpdate();
      setCurrId(null);
      setShow(false);
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h1>
            Are you sure you want to change the status of this task to{" "}
            {`"${nextStatus}"`}
          </h1>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Task</th>
            <th>Description</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.completed ? "table-success" : ""}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.completed ? "Completed" : "In Progress"}</td>
              <td>
                <Button
                  variant={task.completed ? "danger" : "success"}
                  onClick={() => handleConfirm(task)}
                >
                  {task.completed ? "Mark as incomplete" : "Mark as complete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TaskTable;
