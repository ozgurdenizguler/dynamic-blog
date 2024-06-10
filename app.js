const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const DB_FILE = "database.db";
let db = new sqlite3.Database(DB_FILE);

app.use(bodyParser.json());
app.use(express.static("public"));

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title TEXT, description TEXT, image TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY, title TEXT, description TEXT, image TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)"
  );

  db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) => {
    if (err) {
      console.error("Error checking for admin user:", err.message);
      return;
    }

    if (!row) {
      // Admin user does not exist, create it
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", "admin"],
        function (err) {
          if (err) {
            console.error("Error creating admin user:", err.message);
            return;
          }
          console.log("Admin user created successfully!");
        }
      );
    } else {
      console.log("Admin user already exists.");
    }
  });
});

// Kullanıcı girişi
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Kullanıcı adı veya şifre yanlış!" });
      }
    }
  );
});

app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ projects: rows });
  });
});

app.post("/api/projects", (req, res) => {
  const { title, description, image } = req.body;
  db.run(
    "INSERT INTO projects (title, description, image) VALUES (?, ?, ?)",
    [title, description, image],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM projects WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ project: row });
  });
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;
  db.run(
    "UPDATE projects SET title = ?, description = ?, image = ? WHERE id = ?",
    [title, description, image, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// GET all blogs
app.get("/api/blogs", (req, res) => {
  db.all("SELECT * FROM blogs", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ blogs: rows });
  });
});

// POST a new blog
app.post("/api/blogs", (req, res) => {
  const { title, description, image } = req.body;
  db.run(
    "INSERT INTO blogs (title, description, image) VALUES (?, ?, ?)",
    [title, description, image],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET a single blog by ID
app.get("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM blogs WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ blog: row });
  });
});

// PUT (update) a blog by ID
app.put("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;
  db.run(
    "UPDATE blogs SET title = ?, description = ?, image = ? WHERE id = ?",
    [title, description, image, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

// DELETE a blog by ID
app.delete("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM blogs WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  db.run(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
