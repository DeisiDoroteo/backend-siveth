import { pool } from "../db.js";

export const index = (req, res) => res.json({ message: "welcome to my api" });
export const ping = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT "pong" as result');
    res.json(result[0]);
  } catch (error) {
    console.error("Error while pinging the database:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};