import axios from "axios";

const URL_PREFIX = "http://localhost:5000"

//if the account was successfully created, return the userId
//otherwise, return -1
export async function createAccount(username:string, password:string, email:string) : Promise<number>{
    //console.log(`username: ${username}\npassword: ${password}\nemail: ${email}`);

    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/create/`,{
        "username":username,
        "password":password,
        "email":email
    });

    if( axiosResponse.status == 200){
        if (typeof(axiosResponse.data.uid) != "undefined"){
            return axiosResponse.data.uid
        }
    }
    
    return -1;
}

//if login was successful, return the userID
//otherwise, return -1
export async function login(username:string, password:string) : Promise<number>{
    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/login/`,{
        "username":username,
        "password":password
    });

    if( axiosResponse.status == 200){
        if (typeof(axiosResponse.data.uid) != "undefined"){
            return axiosResponse.data.uid
        }
    }
    
    return -1;
}

export async function logout() : Promise<number>{
    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/logout`);

    return axiosResponse.status;
}