import axios from "axios";

const URL_PREFIX = "http://localhost:5000"

export async function createAccount(username:string, password:string, email:string) : Promise<number>{
    //console.log(`username: ${username}\npassword: ${password}\nemail: ${email}`);

    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/create/`,{
        "username":username,
        "password":password,
        "email":email
    });

    return axiosResponse.status;
}

export async function login(username:string, password:string) : Promise<number>{
    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/login/`,{
        "username":username,
        "password":password
    });

    return axiosResponse.status;
}

export async function logout() : Promise<number>{
    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/logout`);

    return axiosResponse.status;
}