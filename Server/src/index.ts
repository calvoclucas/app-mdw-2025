import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/cliente.routes";
import detallePedidoRoutes from "./routes/detallepedido.routes";
import direccionRoutes from "./routes/direccion.routes";
import empresaRoutes from "./routes/empresa.routes";
import historialRoutes from "./routes/historial.routes";
import metodoPagoRoutes from "./routes/metodopago.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/producto.routes";
import pedidoRoutes from "./routes/pedido.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://app-mdw-2025.onrender.com",
      "https://app-mdw-2025.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization","Role"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ON");
});

// Routes
app.use("/Api", authRoutes);
app.use("/Api", clientRoutes);
app.use("/Api", detallePedidoRoutes);
app.use("/Api", direccionRoutes);
app.use("/Api", empresaRoutes);
app.use("/Api", historialRoutes);
app.use("/Api", metodoPagoRoutes);
app.use("/Api", userRoutes);
app.use("/Api", productRoutes);
app.use("/Api", pedidoRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
