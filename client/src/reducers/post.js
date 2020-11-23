import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./../actions/types";

const intialState = {
    allPosts: [],
    post: null,
    loading: true,
    error: {},
};

export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                allPosts: payload,
                loading: false,
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === payload.id
                        ? { ...post, likes: payload.likes }
                        : post
                ),
                loading: false,
            };
        default:
            return state;
    }
}
