
import { Cliente } from "../models/Cliente";
import { Request, Response } from "express";



export const GetClients = async (req: Request, res: Response) => {
 try {
    const clients = await Cliente.find();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al traer los clientes' });
  }
}

export const EditClient = async (req: Request, res: Response) => {
    try {
        const {id_cliente} = req.params;
        const client = await Cliente.findById(id_cliente)

        if(!client)
            return res.status(404).json({message: "Cliente no encontrado"});
        
        res.json(client)

    } catch (err) {
        res.status(404).json({message: "Error en el servidor"})
    }
}

export const CreateClient = async (req: Request, res: Response) => {
    try {

      
            const client = new Cliente(req.body)
            const newClient = await client.save()
            
            res.status(201).json(newClient)

    } catch (err) {
        res.status(404).json({message: "Error en el servidor"})
    }
}