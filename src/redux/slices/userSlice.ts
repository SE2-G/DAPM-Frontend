interface UserInfo {
    fullName: string;
    roles: string[]; // Array of strings type for roles
    userName: string;
}

export const userInfo : UserInfo = {
    fullName: "",
    roles: [],
    userName: ""
}

export interface AdminInfo {
    userRegisterActive: boolean,
}
  
export const adminInfo : AdminInfo = {
    userRegisterActive: true
}

