interface UserInfo {
    fullName: string;
    roles: string[]; // Array of strings type for roles
    userName: string;
    token: string;
}

export const userInfo : UserInfo = {
    fullName: "",
    roles: [],
    userName: "",
    token: ""
}
  
export const adminInfo = {
    userRegisterActive: true,
    userList: []
}

