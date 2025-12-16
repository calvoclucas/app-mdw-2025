import express from "express";
import {
  createUser,
  EditUser,
  getUsers,
  RegisterUser,
} from "../controllers/user.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";

const router = express.Router();

router.post("/CreateUser", authOptional, authRequired, rolesGuard(["empresa"]), createUser);
router.get("/GetUsers", authOptional, authRequired, getUsers);
router.put("/EditUser/:id", authRequired, rolesGuard(["empresa","cliente"]), EditUser);
router.post("/RegisterUser", RegisterUser);

export default router;
 