import axios from "axios";

export interface UserInfoResponse{
    uid:number;
    username?:string;
    email?:string;
}

//if the account was successfully created, return the userId
//otherwise, return 1
export async function createAccount(username:string, password:string, email:string) : Promise<UserInfoResponse>{
    //console.log(`username: ${username}\npassword: ${password}\nemail: ${email}`);

    const axiosResponse = await axios.post(`${__BACKEND_URL__}/auth/v1/create/`,{
        "username":username,
        "password":password,
        "email":email
    });

    if( axiosResponse.status == 200){
        if (typeof(axiosResponse.data.uid) != "undefined"){
            return axiosResponse.data
        }
    }
    
    return {uid:1, username:undefined, email:undefined};
}

//if login was successful, return the userID
//otherwise, return 1
export async function login(username:string, password:string) : Promise<UserInfoResponse>{
    const axiosResponse = await axios.post(`${__BACKEND_URL__}/auth/v1/login/`,{
        "username":username,
        "password":password
    });

    if( axiosResponse.status == 200){
        if (typeof(axiosResponse.data.uid) != "undefined"){
            return axiosResponse.data
        }
    }
    
    return {uid:1, username:undefined, email:undefined};
}

export async function logout() : Promise<UserInfoResponse>{
    await axios.post(`${__BACKEND_URL__}/auth/v1/logout`);

    return {uid:1, username:undefined, email:undefined};
}