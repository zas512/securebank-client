import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

const initialState: User = {
  id: "",
  name: "",
  email: "",
  role: "user",
  token: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    logout: () => initialState
  }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
