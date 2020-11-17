import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import auth from "../../reducers/auth";

const PrivateRoutes = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            !auth.isAuthenticated && !auth.isLoading ? (
                <Redirect to="/login" />
            ) : (
                <Component {...props} />
            )
        }
    />
);

PrivateRoutes.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
