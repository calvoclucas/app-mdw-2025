"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const detallepedido_routes_1 = __importDefault(require("./routes/detallepedido.routes"));
const direccion_routes_1 = __importDefault(require("./routes/direccion.routes"));
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
const historial_routes_1 = __importDefault(require("./routes/historial.routes"));
const metodopago_routes_1 = __importDefault(require("./routes/metodopago.routes"));
// Modelos
const Cliente_1 = __importDefault(require("./models/Cliente"));
const Empresa_1 = __importDefault(require("./models/Empresa"));
const Producto_1 = __importDefault(require("./models/Producto"));
const Pedido_1 = __importDefault(require("./models/Pedido"));
const DetallePedido_1 = __importDefault(require("./models/DetallePedido"));
const Direccion_1 = __importDefault(require("./models/Direccion"));
const MetodoPago_1 = __importDefault(require("./models/MetodoPago"));
const User_1 = __importDefault(require("./models/User"));
const Historial_1 = __importDefault(require("./models/Historial"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Endpoint raíz
app.get("/", (req, res) => {
    res.send("Server is ON");
});
// Seed endpoint
app.post("/Api/seed", async (req, res) => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mi_db_prueba";
        // Conexión a MongoDB si no está conectada
        if (mongoose_1.default.connection.readyState === 0) {
            await mongoose_1.default.connect(MONGO_URI);
            console.log("Conectado a MongoDB");
        }
        // Limpiar colecciones
        await Promise.all([
            Cliente_1.default.deleteMany({}),
            Empresa_1.default.deleteMany({}),
            Producto_1.default.deleteMany({}),
            Pedido_1.default.deleteMany({}),
            DetallePedido_1.default.deleteMany({}),
            Direccion_1.default.deleteMany({}),
            MetodoPago_1.default.deleteMany({}),
            User_1.default.deleteMany({}),
            Historial_1.default.deleteMany({}),
        ]);
        // Crear clientes
        const cliente1 = await Cliente_1.default.create({
            nombre: "Lucas",
            email: "lucas@mail.com",
            password: "1234",
            telefono: "12345678",
        });
        // Crear empresas
        const empresa1 = await Empresa_1.default.create({
            nombre: "SuperComida",
            email: "info@supercomida.com",
            telefono: "98765432",
            horario_apertura: "08:00",
            horario_cierre: "22:00",
            costo_envio: 50,
        });
        // Crear usuarios
        const user1 = await User_1.default.create({
            name: "Lucas",
            lastName: "Gonzalez",
            email: "lucasuser@mail.com",
            role: "cliente",
            cliente: cliente1._id,
        });
        const user2 = await User_1.default.create({
            name: "Empresa Admin",
            lastName: "Admin",
            email: "admin@empresa.com",
            role: "empresa",
            empresa: empresa1._id,
        });
        // Metodo de pago
        const metodoPago1 = await MetodoPago_1.default.create({ tipo: "Tarjeta" });
        // Dirección
        const direccion1 = await Direccion_1.default.create({
            id_user: user1._id,
            calle: "Calle Falsa",
            numero: 123,
            ciudad: "Ciudad X",
            provincia: "Provincia Y",
            cp: "12345",
            coordenadas: { lat: 10.123, lng: -70.456 },
        });
        // Productos
        const producto1 = await Producto_1.default.create({
            id_empresa: empresa1._id,
            nombre: "Hamburguesa",
            descripcion: "Deliciosa hamburguesa con queso",
            precio: 850,
            retiro_local: true,
        });
        const producto2 = await Producto_1.default.create({
            id_empresa: empresa1._id,
            nombre: "Papas Fritas",
            descripcion: "Crocantes y doradas",
            precio: 300,
            retiro_local: true,
        });
        // Pedido
        const pedido1 = await Pedido_1.default.create({
            id_cliente: cliente1._id,
            id_empresa: empresa1._id,
            id_metodo_pago: metodoPago1._id,
            id_direccion: direccion1._id,
            estado: "En preparación",
            total: 1150,
            tiempo_estimado: 45,
        });
        // Detalle de pedido
        await DetallePedido_1.default.create([
            {
                id_pedido: pedido1._id,
                id_producto: producto1._id,
                cantidad: 1,
                precio_unitario: 850,
            },
            {
                id_pedido: pedido1._id,
                id_producto: producto2._id,
                cantidad: 1,
                precio_unitario: 300,
            },
        ]);
        await Historial_1.default.create({
            id_pedido: pedido1._id,
            fechaHistorial: new Date(),
        });
        res.status(201).json({ message: "Seed completado ✅" });
    }
    catch (err) {
        console.error("Error al hacer seed:", err);
        res.status(500).json({ error: "Error al crear datos de prueba" });
    }
});
// Rutas
app.use("/Api", auth_routes_1.default);
app.use("/Api", cliente_routes_1.default);
app.use("/Api", detallepedido_routes_1.default);
app.use("/Api", direccion_routes_1.default);
app.use("/Api", empresa_routes_1.default);
app.use("/Api", historial_routes_1.default);
app.use("/Api", metodopago_routes_1.default);
// Conexión a la DB y levantar servidor
(0, db_1.default)().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
