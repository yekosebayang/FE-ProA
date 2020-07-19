import React from "react";
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <Link className="" style={{ textDecoration: "none", color: "inherit" }} to="/">
        <h1 className="logo-text">FOOD</h1>
        </Link>
        <h1>. . .</h1>
      </div>
    );
  }
}

export default PageNotFound;
