import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Spinner from "./../layout/Spinner";

const VerifyEmail = ({ auth: { isAuthenticated } }) => {
    const [genToken, sendEmail] = useState({
        sentEmail: false,
        loading: false,
    });

    const { sentEmail, loading } = genToken;

    const verifyToken = async (e) => {
        try {
            sendEmail({
                ...genToken,
                loading: true,
            });
            await axios.get("/api/auth/verifyemail");
            sendEmail({
                ...genToken,
                sentEmail: true,
                loading: false,
            });
        } catch (err) {
            console.log(err);
        }
    };

    if (!isAuthenticated) {
        return <Redirect to="/login" />;
    }

    if (loading) {
        return <Spinner />;
    } else if (!sentEmail && !loading) {
        // console.log(sentEmail);
        return (
            <Fragment>
                <h1 className="text-primary large">Verify Your Email</h1>
                <button onClick={verifyToken} className="btn btn-primary my-3">
                    Click to verify
                </button>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <p>An verification link is sent to your email.</p>
            </Fragment>
        );
    }
};

VerifyEmail.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(VerifyEmail);
