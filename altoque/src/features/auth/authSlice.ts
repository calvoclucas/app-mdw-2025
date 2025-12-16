import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  lastName: string;
  role: "empresa" | "cliente";
  empresa?: {
    _id: string;
    nombre: string;
    email?: string;
    telefono?: string;
    costo_envio?: number;
    horario_apertura?: string;
    horario_cierre?: string;
  };
    direccion?: {
    _id: string;
    calle: string;
    ciudad: string;
    cp: string;
    numero: string;
    provincia: string;
  };
  cliente?: {
    _id: string;
    nombre: string;
    puntos?: number;
    telefono?:string; 
  };
  isActive: boolean;
}

interface AuthState {
  user: AppUser | null;
  token: string | null;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: AppUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    setUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
