import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authOptional } from "../middlewares/authoptional";

const router = Router();

router.post("/login", authOptional, login);

export default router;
