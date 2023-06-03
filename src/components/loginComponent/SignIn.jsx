import React, { Component, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";



import { isEmail } from "validator";

import AuthService from "../../services/auth.service"

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};
export default class SignIn extends Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });




    }

    render() {
        return (
            <div fluid className='container p-4'>
                <div className="row">
                    <div className=' col-md-6 text-center text-md-start d-flex flex-column justify-content-center'>

                        <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                            <br />
                            <span className="text-primary"></span>
                        </h1>

                        <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                            L
                        </p>

                    </div>
                    <div className='col-md-6'>

                        <div className=' card my-5'>
                            <div className='card-body p-5'>
                                <form onSubmit={this.handleRegister}
                                    ref={this.form}>
                                    <input className='mb-4' type='text' id='form2Example1' label='Username' value={this.state.username}
                                        onChange={this.onChangeUsername}

                                    />
                                    <input className='mb-4' type='email' id='form2Example1' label='Email'
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}

                                    />
                                    <input className='mb-4' type='password' id='form2Example2' label='Password' value={this.state.password}
                                        onChange={this.onChangePassword}
                                    />



                                    <button type='submit' className='btn btn-primary mb-4' block disabled={this.state.loading}>
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )} Sign in
                                    </button>
                                    {this.state.message && (
                                        <div className="form-group">
                                            <div
                                                className={
                                                    this.state.successful
                                                        ? "alert alert-success"
                                                        : "alert alert-danger"
                                                }
                                                role="alert"
                                            >
                                                {this.state.message}
                                            </div>
                                        </div>
                                    )}

                                    <div className='text-center'>
                                        <p>
                                            Already have an account ? <a href="/login">Register</a>
                                        </p>
                                        {/* <p>or sign up with:</p>

                                        <MDBBtn floating color="secondary" className='mx-1'>
                                            <MDBIcon fab icon='facebook-f' />
                                        </MDBBtn>

                                        <MDBBtn floating color="secondary" className='mx-1'>
                                            <MDBIcon fab icon='google' />
                                        </MDBBtn>

                                        <MDBBtn floating color="secondary" className='mx-1'>
                                            <MDBIcon fab icon='twitter' />
                                        </MDBBtn>

                                        <MDBBtn floating color="secondary" className='mx-1'>
                                            <MDBIcon fab icon='github' />
                                        </MDBBtn>*/}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

