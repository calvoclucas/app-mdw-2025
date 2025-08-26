import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
