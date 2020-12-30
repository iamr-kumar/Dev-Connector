import React, { useState, Fragment } from "react";
import axios from "axios";
import Spinner from "./../layout/Spinner";
import { connect } from "react-redux";
import { setAlert } from "./../../actions/alert";
import PropTypes from "prop-types";

const ForgotPassword = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        email: "",
        loading: false,
        emailSent: false,
    });
    const { email, loading, emailSent } = formData;
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        setFormData({ ...formData, loading: true });
        makeRequest();
    };
    const makeRequest = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const body = JSON.stringify({ email });
        try {
            const res = await axios.post(
                "/api/auth/forgot-password",
                body,
                config
            );
            setFormData({ ...formData, loading: false, emailSent: true });
        } catch (err) {
            setFormData({ ...formData, loading: false });
            setAlert(err.response.data.msg, "danger");
        }
    };
    return loading ? (
        <Spinner />
    ) : !emailSent ? (
        <Fragment>
            <h1 className="large text-primary">Enter your email</h1>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />
            </form>
        </Fragment>
    ) : (
        <Fragment>
            <h2 className="text-primary">Email Sent!</h2>
            <p>A link to reset your password is sent to your email.</p>
        </Fragment>
    );
};

ForgotPassword.propTypes = {
    setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(ForgotPassword);
