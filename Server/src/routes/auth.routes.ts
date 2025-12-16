import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authOptional } from "../middlewares/authoptional";
import { me } from "../controllers/auth.controller";
const router = Router();

router.post("/login", authOptional, login);
router.get("/me", me);
export default router;
