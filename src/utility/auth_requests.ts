import axios from "axios";

const URL_PREFIX = "http://localhost:5000"

export async function createAccount(username:string, password:string, email:string){
    //console.log(`username: ${username}\npassword: ${password}\nemail: ${email}`);

    const axiosResponse = await axios.post(`${URL_PREFIX}/auth/v1/create/`,{
        "username":username,
        "password":password,
        "email":email
    });

    return axiosResponse.status;
}
