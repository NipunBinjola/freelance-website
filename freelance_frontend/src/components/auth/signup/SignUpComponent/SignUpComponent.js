import React, { useState } from "react";
import logo from '../../../../assets/images/logo/logo.svg';
import { Redirect } from "react-router-dom";
import { signUp } from "../../../../services/auth/auth";
import "./SignUpComponent.css";
import ReCAPTCHA from "react-google-recaptcha";
import notify from "../../../../services/toast/Toast";

function SignUpComponent() {
    const [signUpUser, setSignUpUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmPassword: "",
        recaptcha: "",

        fieldError: {},

        success: true,
        loading: false,
        error: "",
        redirect: false,
    });

    const [captcha, setCaptcha] = useState("")

    const handlechange = name => event => {
        setSignUpUser({ ...signUpUser, [name]: event.target.value });
    }

    const onLoading = () => {
        return signUpUser.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const redirectIfSignedUp = () => {
        if (signUpUser.redirect) {
            notify("info", "Please Login To Continue")
            return <Redirect to={{
                pathname: "/signin",
            }} />
        }
    }

    const getFieldErrors = (error) => {
        let tfieldError = signUpUser.fieldError;
        if (error.errors) {
            error.errors.forEach(e => {
                let errorParam = e.param;
                let errorMsg = e.msg;
                tfieldError[errorParam] = errorMsg;
            });
        }

        return tfieldError;
    }

    const errorMessage = () => {
        if (signUpUser.error.errors) {
            return signUpUser.error && <p className="text-center text-danger font-weight-bold">Please Check Your Entries</p>
        } else {
            return signUpUser.error && <p className="text-center text-danger font-weight-bold">{signUpUser.error}</p>
        }
    }

    const fieldErrorMessage = (name) => {
        if (signUpUser.fieldError[name]) {
            return (
                <span className="text-danger">{signUpUser.fieldError[name]}</span>
            );
        }
    }

    const onSubmit = event => {
        event.preventDefault();
        signUpUser.loading = true;
        setSignUpUser({ ...signUpUser, error: "" })
        signUp(signUpUser, captcha)
            .then(data => {
                console.log(data);
                if (data.error) {
                    let tempFieldErrors = getFieldErrors(data.error);
                    setSignUpUser({ ...signUpUser, loading: false, error: data.error, fieldError: tempFieldErrors })
                } else {
                    setSignUpUser({ ...signUpUser, loading: false, error: "", success: true, redirect: true })
                }
            })
            .catch(err => {
                setSignUpUser({ ...signUpUser, loading: false, error: "Please Check Your Internet Connection" })
                // console.log(err);
            })
    }

    const recaptchaVerify = (response) => {
        setCaptcha(response);
    }

    return (

        < div className="row min-height-fix-footer mx-0" >
            {redirectIfSignedUp()}
            < div className="col-md-4 offset-md-4 align-self-center" >

                <div className="card my-5">

                    <div className="card-body">
                        <div className="row justify-content-center align-content-center py-4">
                            <img className="logo-img mt-1" alt="CodePlayer" src={logo} />
                            <div className="d-inline-block ml-2">
                                <span className="d-inline text-danger">Job Wolf</span>
                                <span className="d-block logo-info">Emerging AI Job Portal</span>
                            </div>
                        </div>
                        <h5 className="text-center pb-3">Register Here</h5>
                        {onLoading()}
                        {errorMessage()}
                        <div className="form-group">
                            <span class="input-label">Name</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" id="firstname" placeholder="FirstName" onChange={handlechange("firstname")} />
                            </div>
                            {fieldErrorMessage("name")}
                        </div>
                        <div className="form-group">
                            <span class="input-label">Email</span>
                            <div className="input-group">
                                <input type="text" className="form-text form-control" id="email" placeholder="Email" onChange={handlechange("email")} name="name" />
                            </div>
                            {fieldErrorMessage("email")}
                        </div>
                        <div className="form-group">
                            <span class="input-label">Password</span>
                            <div className="input-group">
                                <input type="password" placeholder="Password" id="password" className="form-text form-control" onChange={handlechange("password")} name="name" />
                            </div>
                            {fieldErrorMessage("password")}
                        </div>
                        <div className="form-group">
                            <span class="input-label">Phone</span>
                            <div className="input-group">
                                <input type="text" placeholder="Phone Number" id="phone" className="form-text form-control" onChange={handlechange("phone")} name="name" />
                            </div>
                            {fieldErrorMessage("phone")}
                        </div>

                        <div className="form-group">
                            <span class="input-label">Country</span>
                            <div className="input-group">
                                <input type="text" placeholder="Country" id="country" className="form-text form-control" onChange={handlechange("country")} name="country" />
                            </div>
                            {fieldErrorMessage("country")}
                        </div>

                        <div className="form-group">
                            <span class="input-label">City</span>
                            <div className="input-group">
                                <input type="text" placeholder="City" id="city" className="form-text form-control" onChange={handlechange("city")} name="city" />
                            </div>
                            {fieldErrorMessage("city")}
                        </div>

                        <div className="form-group">
                            <span class="input-label">City</span>
                            <div className="input-group">
                                <input type="text" placeholder="City" id="city" className="form-text form-control" onChange={handlechange("city")} name="city" />
                            </div>
                            {fieldErrorMessage("city")}
                        </div>

                        <div className="form-group">
                            <span class="input-label">You're Signing up for?</span>
                            <select class="form-select form-control" aria-label="Freelancer">
                                <option selected>Open this select menu</option>
                                <option value="0">Freelancer</option>
                                <option value="1">Employer</option>
                            </select>
                            {fieldErrorMessage("role")}
                        </div>

                        {/* <div className="text-center align-content-center">
                            <ReCAPTCHA 
                                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                                onChange={recaptchaVerify}
                            />
                        </div> */}
    {/* <p>{JSON.stringify(signUpUser)}</p> */}

                        <div className="form-group pt-2">
                            <div className="input-group">
                                <button type="submit" className="btn btn-block btn-warning" disabled={signUpUser.loading || !signUpUser.success} onClick={onSubmit}>Register Now</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
}

export default SignUpComponent;