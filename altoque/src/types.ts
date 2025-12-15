export type Producto = {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  imagen?: string;
};

export type Pedido = {
  _id: string;
  id_cliente?: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  id_empresa?: {
    _id: string;
    nombre: string;
    email: string;
    telefono?: string;
  };
  id_metodo_pago?: {
    _id: string;
    tipo: string;
  };
  id_direccion?: {
    _id: string;
    calle?: string;
    numero?: number;
    ciudad?: string;
    provincia?: string;
    cp?: string;
  };
  estado?: string;
  total?: number;
  tiempo_estimado?: number;
  fecha?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type EmpresaConUsuario = {
  _id: string;
  email: string;
  productos?: Producto[];
  empresa?: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
    horario_apertura: string;
    horario_cierre: string;
    costo_envio: number;
    categoria?: string;
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

export type EstadoPedido =
  | "pendiente"
  | "en progreso"
  | "entregado"
  | "cancelado";
