const { API } = require("../backend");

export const signUp = (user, captcha) => {
    user.recaptcha = captcha;
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}

export const signIn = user => {
    return fetch(`${API}/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "PostmanRuntime/7.29.4",
        },
        body: JSON.stringify(user)
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}

export const authenticate = (data, next) => {
    if (typeof window !== undefined) {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
}

export const signout = next => {
    if (typeof window !== undefined) {
        localStorage.removeItem("jwt");
        

        return fetch(`${API}/signout`, {
            method: "GET"
        })
            .then(response => (response.json()))
            .catch(err => ({ error: "Please Check Your Internet Conenction" }));
    }
}

export const isAuthenticated = () => {
    if (typeof window === undefined) {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
}