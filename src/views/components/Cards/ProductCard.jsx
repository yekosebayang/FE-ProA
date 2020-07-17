import React from "react";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import Axios from "axios";

import "./ProductCard.css";
import ButtonUI from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar, faPlusSquare } from "@fortawesome/free-regular-svg-icons";

class ProductCard extends React.Component {

  render() {
    const {productdesc, productname, productprice, productimage } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <img
          src={productimage}
          alt={productname}
          style={{ width: "auto", height: "auto", objectFit: "contain" }}
        />
        <div>
          <p className="mt-3">{productname}</p>
          <h5 style={{ fontWeight: "bolder" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(productprice)}
          </h5>
          <p className="small">{productdesc}</p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between mt-2">
          <div>
            <div className="d-flex flex-row align-items-center justify-content-between">
              {/* Render stars dynamically */}
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <small className="ml-2">4.5</small>
            </div>
          </div>
          <ButtonUI
            type="outlined"
            style={{ fontSize: "12px", padding: "4px 8px" }}
            onClick={this.props.onClick}
          >
            {" "}
            <FontAwesomeIcon icon={faPlusSquare} /> Tambah
          </ButtonUI>
        </div>
      </div>
    );
  }
}

export default (ProductCard);