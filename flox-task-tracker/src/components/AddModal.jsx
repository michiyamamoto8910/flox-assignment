import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function AddModal({ onAddTask }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFields = () => {
    setDescription("");
    setTitle("");
    setCompleted(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setTitleError(true);
      return;
    }
    const newTask = {
      title,
      description,
      completed,
    };

    try {
      const res = await fetch("http://localhost:8080/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) {
        throw new Error("Failed to add task");
      }
      <Alert variant={"success"}>Successfully added task!</Alert>;
      alert("Successfully added task!");
      resetFields();
      handleClose();
      onAddTask();
    } catch (error) {
      alert("Something went wrong while adding the task.");
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add task +
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title>Add a new task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="taskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => {
                  titleError && setTitleError(false);
                  setTitle(e.target.value);
                }}
                isInvalid={titleError}
              />
              <Form.Control.Feedback type="invalid">
                This field is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="taskDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskCompleted">
              <Form.Check
                type="checkbox"
                label="This is a completed task"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddModal;
