// api.js

import axios from "axios";

const api = axios.create({

    baseURL:
        "https://obligatorio-full-stack-kappa.vercel.app/v1"

});

api.interceptors.request.use(

    config => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    }

);

export default api;