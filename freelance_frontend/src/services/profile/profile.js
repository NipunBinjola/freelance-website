import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getProfileDetails = () => {
    console.log("======================")
    console.log(isAuthenticated())
    console.log("======================")
    let userId = isAuthenticated()["user"]["id"]
    return fetch(`${API}/users/${userId}`, {
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