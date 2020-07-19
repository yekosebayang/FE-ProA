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
    const {productdesc, productname, productprice, productimage, productsold } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <img
          src={productimage}
          alt={productname}
          style={{ width: "auto", height: "auto", objectFit: "contain" }}
        />
        <div className>
          <strong className="mt-3">{productname}</strong>
          <h5 style={{ fontWeight: "bolder", color:"#ff9600" }}>
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
            <div className="terjual"
            type="outlined"
            style={{ fontSize: "12px", padding: "4px 8px" }}
          > Terjual {productsold}
          </div>
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