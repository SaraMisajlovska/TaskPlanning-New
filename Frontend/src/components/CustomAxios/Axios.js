import axios, { Axios } from "axios";

const instance = axios.create({
    baseURL:"http://localhost:9091/api",
    headers: {
        "Access-Control-AllowOrigin": "*"
    }
})

export default instance