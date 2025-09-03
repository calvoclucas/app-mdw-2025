const express = require('express');
import {GetClients, EditClient, CreateClient} from '../controllers/client.controller'

const router = express.Router()

router.post('/CreateClients',CreateClient )
router.get('/GetClients',GetClients)
router.put('/EditClients', EditClient)

export default router;
