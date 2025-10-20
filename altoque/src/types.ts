export type Pedido = {
  _id: string;
  clienteNombre: string;
  total: number;
  estado: string;
  createdAt: string;
};

export type EmpresaConUsuario = {
  _id: string;
  email: string;
  empresa?: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
    horario_apertura: string;
    horario_cierre: string;
    costo_envio: number;
  };
  direccion?: {
    calle: string;
    numero: number;
    ciudad: string;
    provincia: string;
    cp: string;
    coordenadas: { lat: number; lng: number };
  };
};
