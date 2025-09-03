import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/cliente.routes";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ON");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Routers
app.use("/Api", authRoutes);
app.use("/Api", clientRoutes);