"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is ON");
});
app.post("/users", async (req, res) => {
    console.log("Body recibido:", req.body); // <-- agregalo
    try {
        const user = new User_1.default(req.body);
        const saved = await user.save();
        res.status(201).json(saved);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
