import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./../layout/Spinner";
import { connect } from "react-redux";
import { setAlert } from "./../../actions/alert";
import PropTypes from "prop-types";

const ChangePassword = ({ setAlert }) => {
    const { id } = useParams();
    const [tokenInfo, setTokenInfo] = useState({
        isVerified: false,
        loading: true,
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        password2: "",
        resetDone: false,
    });

    const { isVerified, loading } = tokenInfo;
    const { password, password2, resetDone } = passwordData;

    const verifyToken = async () => {
        try {
            const res = await axios.get(`/api/auth/verifytoken/${id}`);
            if (res.status === 200) {
                setTokenInfo({
                    ...tokenInfo,
                    isVerified: true,
                    loading: false,
                });
                setAlert(res.data.msg, "success");
            }
        } catch (err) {
            setTokenInfo({ ...tokenInfo, loading: false });
            // console.log(err);
            setAlert(err.response.data.msg, "danger");
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const onChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("Passwords do not match!", "danger");
        } else {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ password, id });
            try {
                const res = await axios.post(
                    "/api/auth/change-password",
                    body,
                    config
                );
                if (res.status === 200) {
                    setAlert(res.data.msg, "success");
                    setPasswordData({ ...passwordData, resetDone: true });
                }
            } catch (err) {
                // console.log(err);
                setAlert(err.response.data.msg, "danger");
            }
        }
    };

    return loading ? (
        <Spinner />
    ) : !isVerified ? (
        <Fragment>
            <h2 className="text-primary">
                Oops, some error occurred. Please try again!
            </h2>
        </Fragment>
    ) : resetDone ? (
        <Fragment>
            <h2 className="text-primary">Your password has been reset</h2>
            <Link to="/login">
                <button className="btn btn-primary">Log In</button>
            </Link>
        </Fragment>
    ) : (
        <Fragment>
            <h1 className="large text-primary">Reset Your Password</h1>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={onChange}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Reset"
                />
            </form>
        </Fragment>
    );
};

ChangePassword.propTypes = {
    setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(ChangePassword);
