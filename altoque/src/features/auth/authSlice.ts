import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppUser {
  uid?: string;
  _id?: string;
  email: string;
  name: string;
  lastName: string;
  role?: "cliente" | "empresa";
  empresa?: {
    _id: string;
    nombre: string;
  };
}

interface AuthState {
  user: AppUser | null;
}

const storedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
