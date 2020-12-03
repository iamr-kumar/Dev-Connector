import React, { Fragment, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { verifyToken } from "../../actions/auth";
import Spinner from "./../layout/Spinner";

const VerifyToken = ({ auth: { isVerified, loading }, verifyToken }) => {
    const token = useParams();
    console.log(token.id);
    useEffect(() => {
        verifyToken(token.id);
    }, [verifyToken]);

    if (loading) {
        return <Spinner />;
    } else if (isVerified) {
        return (
            <Fragment>
                <h3 className="text-primary text-center">Account Verified</h3>
                <Link to="/login">
                    <div className="align-center mt-3">
                        <button className="btn btn-primary">Login</button>
                    </div>
                </Link>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <h3 className="text-primary text-center">
                    Some error occurred. Try again.
                </h3>
                <Link to="/verifyemail">
                    <div className="align-center mt-3">
                        <button className="btn btn-primary">Verify</button>
                    </div>
                </Link>
            </Fragment>
        );
    }
};

VerifyToken.propTypes = {
    auth: PropTypes.object.isRequired,
    verifyToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { verifyToken })(VerifyToken);
