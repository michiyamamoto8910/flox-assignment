import "./home.css";
import AddModal from "./components/AddModal";
import TaskTable from "./components/Table";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const getTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/tasks");
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      const data = await res.json();
      // sort in a way that in progress tasks are shown first
      const sortedData = [...data].sort((a, b) => a.completed - b.completed);
      setTasks(sortedData);
    } catch (error) {
      alert("Failed to fetch tasks");
    }
  };
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "in-progress") return !task.completed;
    return true; //all
  });
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div class="header">
        <h1 class="header-title">Flox</h1>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <div style={{ width: "70%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <div style={{ flex: 1, maxWidth: "20%" }}>
              <Form.Group controlId="filterSelect">
                <Form.Label>
                  <strong>View by Status</strong>
                </Form.Label>
                <Form.Select
                  aria-label="Filter tasks"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div>
              <AddModal onAddTask={getTasks} />
            </div>
          </div>
          <div>
            <TaskTable tasks={filteredTasks} onTaskUpdate={getTasks} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
