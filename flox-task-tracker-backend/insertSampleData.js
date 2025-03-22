const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tasktracker.db", (err) => {
  if (err) {
    console.error("Failed to connect to DB:", err.message);
    return;
  }
  console.log("Connected to database");
  db.run(
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
        return;
      }

      //clear existing records
      db.run(`DELETE FROM tasks`);

      const tasks = [
        {
          title: "Finish backend",
          description: "setup SQlite3, create api routes, test api routes",
          completed: 1,
        },
        {
          title: "Write Readme",
          description: "Complete readme in your repository",
          completed: 0,
        },
        {
          title: "Create main table",
          description: "Create the main table for tasks",
          completed: 0,
        },
        {
          title: "Create modal for adding task",
          description:
            "Create the modal for adding tasks add inputs for title and description",
          completed: 1,
        },
        {
          title: "Add filter",
          description: "Add filter for in-progress and completed",
          completed: 0,
        },
      ];

      const query = db.prepare(
        `INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)`
      );
      tasks.forEach((task) => {
        query.run(task.title, task.description, task.completed);
      });

      query.finalize(() => {
        console.log("Sample tasks inserted");
        db.close();
      });
    }
  );
});
