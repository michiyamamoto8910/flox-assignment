const express = require('express');
const app = express();
const port = 8080;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// allow request only from localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json());

//for testing only
app.get('/', (req, res) => {
    res.send('Task tracker backend is running!')
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
})

const db = new sqlite3.Database('./tasktracker.db', (err) => {
    if(err) {
        console.log('Failed to connect to DB:', err.message);
    } else {
        console.log('Connected to SQlite database')
    }
})

db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0
    )
`);

app.post('/addTask', (req, res) => {
    const {title, description, completed} = req.body;

    const sql = `INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)`;
    const params = [title, description, completed];

    db.run(sql, params, function (err) {
        if(err) {
            res.status(500).json({error: err.message});
        } else {
            res.status(201).json({
                id: this.lastID,
                title: title,
                description: description,
                completed: completed
            })
        }
    })
})

app.get('/tasks', (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if(err) {
            return res.status(500).json({error: err.message})
        }
        res.json(rows);
    });
});

app.patch('/tasks/:id/change', (req,res) => {
    const taskId = req.params.id;

    db.get(`SELECT completed FROM tasks WHERE id= ?`, [taskId], (err, row) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }

        const newStatus = row.completed === 1 ? 0 : 1;

        db.run(`UPDATE tasks SET completed = ? WHERE id = ?`, [newStatus, taskId], function(err) {
            if(err) {
                return res.status(500).json({error: err.message});
            }
            res.json({
                id: taskId,
                completed: newStatus
            })
        })
    })
})