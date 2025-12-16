import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authOptional } from "../middlewares/authoptional";
import { me, deleteUser } from "../controllers/auth.controller";

const router = Router();

router.post("/login", authOptional, login);
router.get("/me", me);
router.put("/DeleteUser/:id",deleteUser);
export default router;
