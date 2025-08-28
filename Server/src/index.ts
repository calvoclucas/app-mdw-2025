import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import User from "./models/User";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.post("/users", async (req, res) => {
  console.log("Body recibido:", req.body);
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
