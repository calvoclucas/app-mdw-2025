import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppUser {
  uid?: string;
  _id?: string;
  email: string;
  name: string;
  lastName: string;
  role?: "cliente" | "empresa";
}

interface AuthState {
  user: AppUser | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
