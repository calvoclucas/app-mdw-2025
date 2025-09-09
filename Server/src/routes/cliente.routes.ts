const express = require("express");
import {
  GetClients,
  EditClient,
  CreateClient,
  DeleteClient,
} from "../controllers/client.controller";

const router = express.Router();

router.post("/CreateClient", CreateClient);
router.get("/GetClients", GetClients);
router.put("/EditClient", EditClient);
router.delete("/DeleteClient", DeleteClient);

export default router;
