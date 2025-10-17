import express from "express";
import {
  createUser,
  EditUser,
  getUsers
} from "../controllers/user.controller";

const router = express.Router();

router.post("/CreateUser", createUser);
router.get("/GetUsers", getUsers);
router.put("/EditUser/:id_user", EditUser);

export default router;