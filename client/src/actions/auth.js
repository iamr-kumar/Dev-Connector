import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT,
    CLEAR_PROFILE,
    TOKEN_VERIFIED,
} from "./types";

// Load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (error) {
        console.log(error.response);
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Register user
export const register = ({ name, email, password }) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const body = JSON.stringify({ name, email, password });
    try {
        const res = await axios.post("/api/users", body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
        dispatch(setAlert("REGISTERED", "success"));
        dispatch(loadUser());
    } catch (error) {
        console.log(error.response);
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "danger"));
            });
        }
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

// Login user
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post("/api/auth", body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(setAlert("LOGGED IN", "success"));
        dispatch(loadUser());
    } catch (error) {
        console.log(error.response);
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "danger"));
            });
        }
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

// Verify token
export const verifyToken = (token) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/auth/confirmation/${token}`);
        dispatch({
            type: TOKEN_VERIFIED,
        });
        dispatch(setAlert(res.data.msg, "success"));
    } catch (err) {
        const error = err.response.data;
        dispatch(setAlert(error.msg, "danger"));
    }
};

// Logout / clear profile
export const logout = () => (dispatch) => {
    dispatch({
        type: CLEAR_PROFILE,
    });
    dispatch({
        type: LOGOUT,
    });
};
