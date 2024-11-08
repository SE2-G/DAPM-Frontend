interface UserInfo {
    fullName: string;
    roles: string[]; // Array of strings type for roles
    userName: string;
    token: string;
}

// Define the User interface
export interface User {
    id: number;
    fullName: string;
    userName: string;
    password: string;
    organizationName: string;
    organizationId: string;
    roles: string[];
    token: string | null;
}

export const userInfo : UserInfo = {
    fullName: "",
    roles: [],
    userName: "",
    token: ""
}
  
export const adminInfo = {
    userRegisterActive: true,
    userList: [],
    userSelected: null as User | null,
}

