import axios, { Axios } from "axios";

const instance = axios.create({
    baseURL:"http://localhost:9090/api/",
    headers: {
        "Access-Control-AllowOrigin": "*"
    }
})

export default instance;