import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getAllJobs = () => {
    return fetch(`${API}/jobs`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated()["user"]["authentication_token"]
        }
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}