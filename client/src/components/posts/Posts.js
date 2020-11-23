import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";
import { connect } from "react-redux";
import { getPosts } from "./../../actions/post";
import Spinner from "./../layout/Spinner";

const Posts = ({ post: { allPosts, loading }, getPosts }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className="text-primary large">Posts</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Welcome to the Comunity
            </p>
            <div className="posts">
                {allPosts.map((post) => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
