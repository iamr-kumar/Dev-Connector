import axios from "axios";
import { setAlert } from "./alert";
import { login } from "./auth";

import {
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    GET_REPOS,
} from "./types";

// Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
    dispatch({
        type: CLEAR_PROFILE,
    });
    try {
        const res = await axios.get("/api/profile/me");
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/profile");

        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
        dispatch({
            type: CLEAR_PROFILE,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get github repos
export const getGithubRepos = (username) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        console.log(res);
        dispatch({
            type: GET_REPOS,
            payload: res.data,
        });
    } catch (err) {}
};

// Create or Update a profile
export const createProfile = (formData, history, edit = false) => async (
    dispatch
) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const res = await axios.post("/api/profile", formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
        dispatch(
            setAlert(edit ? "Profile updated!" : "Profile created!", "success")
        );

        history.push("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addExperience = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const res = await axios.put(
            "/api/profile/experience",
            formData,
            config
        );

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Added!", "success"));

        history.push("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addEducation = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const res = await axios.put("/api/profile/education", formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Education Added!", "success"));

        history.push("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Experience removed!", "success"));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Education removed!", "success"));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Delete Account and Profile
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm("Are you sure? This cannot be undone!")) {
        try {
            const res = await axios.delete("/api/profile");
            dispatch({
                type: CLEAR_PROFILE,
            });
            dispatch({
                type: DELETE_ACCOUNT,
            });
            dispatch(
                setAlert("Your account has been permanently deleted", "danger")
            );
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    }
};
