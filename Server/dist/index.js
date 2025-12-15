"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const detallepedido_routes_1 = __importDefault(require("./routes/detallepedido.routes"));
const direccion_routes_1 = __importDefault(require("./routes/direccion.routes"));
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
const historial_routes_1 = __importDefault(require("./routes/historial.routes"));
const metodopago_routes_1 = __importDefault(require("./routes/metodopago.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const pedido_routes_1 = __importDefault(require("./routes/pedido.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://app-mdw-2025.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is ON");
});
// Routes
app.use("/Api", auth_routes_1.default);
app.use("/Api", cliente_routes_1.default);
app.use("/Api", detallepedido_routes_1.default);
app.use("/Api", direccion_routes_1.default);
app.use("/Api", empresa_routes_1.default);
app.use("/Api", historial_routes_1.default);
app.use("/Api", metodopago_routes_1.default);
app.use("/Api", user_routes_1.default);
app.use("/Api", producto_routes_1.default);
app.use("/Api", pedido_routes_1.default);
(0, db_1.default)().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
