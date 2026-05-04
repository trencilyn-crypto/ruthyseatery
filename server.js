import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ===== STATIC (for frontend build if needed) =====
app.use(express.static(path.join(__dirname, "dist")));

// ===== AIVEN MYSQL CONNECTION =====
const pool = mysql.createPool({
  uri: process.env.AIVEN_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

// ===== INIT DATABASE =====
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT,
        name TEXT,
        username TEXT,
        role VARCHAR(50),
        status VARCHAR(50) DEFAULT 'approved',
        auth_method VARCHAR(50),
        avatar_url TEXT,
        bio TEXT,
        verification_code TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        title TEXT,
        description TEXT,
        date TEXT,
        time TEXT,
        location TEXT,
        category TEXT,
        organizer TEXT,
        image_url TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY DEFAULT 1,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_image_url TEXT,
        site_logo TEXT,
        brand_name TEXT,
        footer_desc TEXT,
        contact_email TEXT,
        contact_phone TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        id VARCHAR(50) PRIMARY KEY,
        user_id TEXT,
        user_name TEXT,
        user_email TEXT,
        request_type TEXT,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_response TEXT
      )
    `);

    await pool.query(`
      INSERT IGNORE INTO settings (id, hero_title, hero_subtitle, brand_name)
      VALUES (1, 'Your Gateway to Campus Life', 'Discover events easily', 'CampusEvents')
    `);

    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }
};

initDb();

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ===== AUTH =====
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  const id = Math.random().toString(36).substring(2, 9);
  const status = role === "admin" ? "pending" : "approved";

  try {
    await pool.query(
      "INSERT INTO users (id, email, password, name, role, status, auth_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, email, password, name, role || "user", status, "email"]
    );

    res.status(201).json({ id, email, name, role, status });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    if (rows[0].status === "pending")
      return res.status(403).json({ message: "Admin approval required" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// ===== EVENTS =====
app.get("/api/events", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM events");
  res.json(rows);
});

app.post("/api/events", async (req, res) => {
  const { title, description, date, time, location, category, organizer, imageUrl } = req.body;
  const id = Math.random().toString(36).substring(2, 9);

  await pool.query(
    "INSERT INTO events (id, title, description, date, time, location, category, organizer, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, title, description, date, time, location, category, organizer, imageUrl]
  );

  res.status(201).json({ success: true });
});

app.delete("/api/events/:id", async (req, res) => {
  await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
  res.json({ message: "Deleted" });
});

// ===== SUPPORT =====
app.post("/api/support", async (req, res) => {
  const { userId, userName, userEmail, requestType, description } = req.body;
  const id = Math.random().toString(36).substring(2, 9);

  await pool.query(
    "INSERT INTO support_requests (id, user_id, user_name, user_email, request_type, description) VALUES (?, ?, ?, ?, ?, ?)",
    [id, userId, userName, userEmail, requestType, description]
  );

  res.status(201).json({ success: true });
});

app.get("/api/support", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM support_requests ORDER BY created_at DESC"
  );
  res.json(rows);
});

// ===== SETTINGS =====
app.get("/api/settings", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM settings WHERE id = 1");
  res.json(rows[0]);
});

app.post("/api/settings", async (req, res) => {
  const data = req.body;

  await pool.query(
    `
    UPDATE settings SET
      hero_title = ?,
      hero_subtitle = ?,
      hero_image_url = ?,
      site_logo = ?,
      brand_name = ?,
      footer_desc = ?,
      contact_email = ?,
      contact_phone = ?
    WHERE id = 1
    `,
    [
      data.hero_title,
      data.hero_subtitle,
      data.hero_image_url,
      data.site_logo,
      data.brand_name,
      data.footer_desc,
      data.contact_email,
      data.contact_phone,
    ]
  );

  res.json({ success: true });
});

// ===== API FALLBACK =====
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ===== SPA FALLBACK =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
