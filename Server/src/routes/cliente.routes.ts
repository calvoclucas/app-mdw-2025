const express = require("express");
import {
  GetClients,
  EditClient,
  CreateClient,
  DeleteClient,
  GetClientById
} from "../controllers/client.controller";
import { authOptional } from "../middlewares/authoptional";
import { authRequired } from "../middlewares/authrequiered";
import { rolesGuard } from "../middlewares/rolesguard";

const router = express.Router();

router.post("/CreateClient",authRequired, rolesGuard(["cliente"]), CreateClient);
router.get("/GetClients",authOptional, GetClients);
router.get("/GetClientById/:id", authOptional, GetClientById);
router.put("/EditClient/:id", authRequired, rolesGuard(["cliente"]), EditClient);
router.delete("/DeleteClient/:id", authRequired, DeleteClient);

export default router;
