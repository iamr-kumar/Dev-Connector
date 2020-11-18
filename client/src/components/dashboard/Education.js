import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";

const Education = ({ education }) => {
    const educations = education.map((ed) => (
        <tr key={ed._id}>
            <td>{ed.school}</td>
            <td className="hide-sm">{ed.degree}</td>
            <td>
                <Moment format="YYYY/MM/DD">{ed.from}</Moment> -{" "}
                {ed.to === null ? (
                    "Now"
                ) : (
                    <Moment format="YYYY/MM/DD">{ed.to}</Moment>
                )}
            </td>
            <td>
                <button className="btn btn-danger">Delete</button>
            </td>
            
        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Education Details</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Year</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
};

export default Education;
