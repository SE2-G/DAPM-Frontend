// Author: s224768

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Variable information on the users in the adminpage
interface UserInfo {
    fullName: string;
    roles: string[];
    userName: string;
    token: string;
}

//The info on the logged in user
export interface User {
    Id: number;
    FullName: string;
    UserName: string;
    Password: string;
    OrganizationName: string;
    OrganizationId: string;
    Roles: string[];
    Token: string | null;
}

//the information on the users in the adminpage
export const userInfo : UserInfo = {
    fullName: "",
    roles: [],
    userName: "",
    token: ""
}

// the variable information on the admin page
export const adminInfo = {
    userRegisterActive: true,
    userList: [],
    userSelected: null as User | null,
}

//Authentication for security from the login page, so you can't enter without login
export interface AuthState {
    isAuthenticated: boolean;
  }
  
  const initialState: AuthState = {
    isAuthenticated: false,
  };
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setAuthenticated(state, action: PayloadAction<boolean>) {
        state.isAuthenticated = action.payload;
      },
    },
  });
  
  export const { setAuthenticated } = authSlice.actions;
  export default authSlice.reducer;

