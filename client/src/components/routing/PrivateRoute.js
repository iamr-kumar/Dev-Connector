import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import VerifyEmail from "./../auth/VerifyEmail";

const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading, isVerified },
    ...rest
}) => (
    <Route
        {...rest}
        render={
            (props) => {
                if (!isAuthenticated && !loading) {
                    return <Redirect to="/login" />;
                }
                if (isAuthenticated && !isVerified) {
                    return <Redirect to="/verifyemail" />;
                } else {
                    return <Component {...props} />;
                }
            }
            // !isAuthenticated && !loading ? (
            //     <Redirect to="login" />
            // ) : (
            //     <Component {...props} />
            // )
        }
    />
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
