import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faTrashAlt, faMinusSquare, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { priceFormatter } from "../../../supports/helpers/formatter";
import { fillCart } from "../../../redux/actions";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

const Kecamatan = [
  {
    nama: "Solitude",
    jarak: 10
  },
  {
    nama: "Dunstad",
    jarak: 9
  },
  {
    nama: "Markarth",
    jarak: 8
  },
  {
    nama: "Dawnstar",
    jarak: 7
  },
  {
    nama: "winterhold",
    jarak: 6
  },
  {
    nama: "Windhelm",
    jarak: 5
  },
  {
    nama: "Whiterun",
    jarak: 4
  },
  {
    nama: "Eastmarch",
    jarak: 3
  },
  {
    nama: "Falkreath",
    jarak: 2
  },
  {
    nama: "Riften",
    jarak: 1
  }
]

class Cart extends React.Component {
  state = {
    cartData: [],
    checkoutItems: [],
    shipping: 10,
    alamat: {
      perum: "",
      rt: "",
      rw: "",
      kelurahan: ""
    },
    // chkbox: true
  };

  getCartData = () => {
    Axios.get(`${API_URL}/carts/user/${this.props.user.id}`)
      .then((res) => {
        console.log(res.data[0]);
        this.setState({ cartData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
    console.log(field,form +": "+ this.state[form][field])
  };

  checkboxHandler = (e, id) => {
    const { checked } = e.target;

    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, id] });
    } else {
      this.setState({
        checkoutItems: [
          ...this.state.checkoutItems.filter((val) => val !== id),
        ],
      });
    }
    console.log(this.state.checkoutItems)
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData()
      })
      .catch((err) => {
        console.log("gagal delete gan")
        console.log(err);
      });
  };

  renderShippingPrice = () => {
    const { shipping } = this.state
    if (this.state.shipping >= 9){
        return priceFormatter(40000);
    } else if (shipping <= 8 && shipping >=7){
        return priceFormatter(32000);
    } else if (shipping <= 6 && shipping >= 5){
        return priceFormatter(24000);
    } else if (shipping <= 4 && shipping >= 3){
        return priceFormatter(16000);
    } else if (shipping <= 2 && shipping >= 1){
        return priceFormatter(8000);
    } 
    // switch (this.state.shipping >= 9) {
    //   case 10,9:
    //     return priceFormatter(40000);
    //   case 8,7:
    //     return priceFormatter(32000);
    //   case 6,5:
    //     return priceFormatter(24000);
    //   case 4,3:
    //     return priceFormatter(16000);
    //   case 2,1:
    //     return priceFormatter(8000);
    //   default:
    //     return 8000;
    // }
  };

  checkoutHandler = () => {
    const { perum, rt, rw, kelurahan} = this.state.alamat
    let Alamat = perum+", "+rt+"/"+rw+", "+kelurahan
    Axios.post(`${API_URL}/transactions/new/${this.props.user.id}`, {
      totalprice: this.renderTotalPrice(),
      shipprice: this.renderSubTotalPrice(),
      status: "belum",
      shippingaddress: Alamat,
    })
      .then((res) => {
        this.state.cartData.forEach((val) => {
          const { quantity, product } = val;
          const { productprice, id } = product;

          Axios.post(`${API_URL}/details/${res.data.transactionId}/${id}`, {
            productprice,
            quantity,
            totalPrice: productprice * quantity
          })
          .then((res) => {
            console.log("SUKSES GAN")
          })
          .catch((err) => {
            console.log(err.response.data.message)
          });
        });
      })
      .then((res) => {
        Axios.delete(`${API_URL}/carts/all/${this.props.user.id}`)
        .then((res) =>{
          this.getCartData()
        })
        .catch((err) => {
          console.log(err)
        })
      });
  };

  componentDidMount() {
    this.getCartData();
  }

  renderTotalPrice = () => {
    let totalPrice = 0;

    this.state.cartData.forEach((val) => {
    // this.state.checkoutItems.forEach((val) => {
      const { quantity, product } = val;
      const { productprice } = product;

      totalPrice += quantity * productprice;
    });

    let shippingPrice = 0;

    switch (this.state.shipping) {
      case "instant":
        shippingPrice = 100000;
        break;
      case "sameDay":
        shippingPrice = 50000;
        break;
      case "express":
        shippingPrice = 20000;
        break;
      default:
        shippingPrice = 0;
        break;
    }

    return totalPrice + shippingPrice;
  };

  renderSubTotalPrice = () => {
    let totalPrice = 0;

    this.state.cartData.forEach((val) => {
      const { quantity, product } = val;
      const { productprice } = product;

      totalPrice += quantity * productprice;
    });

    return totalPrice;
  };
  
  renderHeadProductList = () => {
    return(
      <>
        <table className="dashboardCart-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Harga</th>
              <th>Jumlah</th>
              <th>Total harga</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.renderCartData()}</tbody>
        </table>
      </>
    )
  }

  renderCartData = () => {
    console.log(this.state.cartData)
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, cartId } = val;
      const { productname, productimage, productprice } = product;
      return (
        <tr>
          <td>
            <div className="container">
                <div>
                  <strong>{productname}</strong>
                </div>
                <img className="mr-4"
                  src={productimage}
                  alt=""
                  style={{ width: "100px", height: "100px", objectFit: "contain"}}/>
            </div>
          </td>
          <td style={{ verticalAlign: "middle" }}>
            <strong>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(productprice)}
            </strong>
          </td>
          <td style={{ verticalAlign: "middle" }}>
            <strong>{quantity}</strong>
          </td>
          <td>
            <strong>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(productprice * quantity)}
            </strong>
          </td>
          <td>
            <FontAwesomeIcon
              onClick={() => this.deleteCartHandler(cartId)}
              className="delete-icon"
              icon={faMinusSquare}
              style={{ fontSize: "40px"}}
            />
          </td>
        </tr>
      );
    });
  };

  renderKecamatan = () => {
    return Kecamatan.map(({ nama, jarak }) => {
      return(
        <option value={jarak}>{nama}</option>
      )
    })
  }

  renderNavCard = () => {
    return(
      <div>
        <div>
          <div className="card-header cardNav-header mt-2">
            <h5 className="card-title">Harga</h5>
          </div>
          <div className=" textPreviewCart">
            <h5 className="mb-3">Alamat Kirim</h5>
            <TextField className="mb-1" placeholder="Alamat"
            onChange={(e) => this.inputHandler(e, "perum", "alamat")}
            ></TextField>
            <div className="mb-1 container">
              <div className="row">
                <TextField className="col mr-1" placeholder="RT"
                onChange={(e) => this.inputHandler(e, "rt", "alamat")}
                ></TextField>
                <TextField className="col ml-1" placeholder="RW"
                onChange={(e) => this.inputHandler(e, "rw", "alamat")}></TextField>
              </div>
            </div>
            <TextField className="mb-2" placeholder="Kelurahan"
                onChange={(e) => this.inputHandler(e, "kelurahan", "alamat")}></TextField>
            <div className="container mb-1">
              <div className="row">
                <strong className="col mt-2">Kecamatan</strong>
                <div>
                <select onChange={(e) => this.setState({ shipping: e.target.value })}
                className="form-control col">
                  {this.renderKecamatan()}
                </select>
                </div>
              </div>
            </div>
            <div className="container">
            <div className="row">
              <strong className="col">Biaya Kirim: </strong>
              <span>
                {this.renderShippingPrice()}
              </span>
            </div>
          </div>
          </div>
          <div className=" textPreviewCart">
            <h5 className="mb-3">Total bayar</h5>
            <div className="container">
                <div className="row">
                  <strong className="col">Harga: </strong>
                  <strong>{priceFormatter(this.renderSubTotalPrice())}</strong>
                </div>
            </div>
            <div className="container">
              <div className="row">
                <strong className="col">Biaya Kirim:</strong>
                <strong>{this.renderShippingPrice()}</strong>
              </div>
            </div>
            <div className="row mt-3">
              <h5 className="col">TOTAL</h5>  
              <h5 className="col-auto">{priceFormatter(this.renderTotalPrice())}</h5>
            </div>
            <ButtonUI className="mt-3 login-modal-btn" type="outlined"
            onClick={(e) => {this.checkoutHandler()}}
            >
              Bayar
            </ButtonUI>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.cartData.length) {
      return (
        <div className="container py-1">
          <div className="row">
            <div className="col-3 py-2 px-1 container">
              {this.renderNavCard()}
            </div>
            <div className="col py-2">
              <div className="dashboardCart">
                <div className="customhdbg">
                <caption ClassName="py-2 pl-2" style={{color: "black"}}>
                  <h2>Keranjang</h2>
                </caption>
                </div>
                {this.renderHeadProductList()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container py-4">
          <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
              <div className="alert alert-info">Keranjang kosong?{" "}
                <Link to="/">Pesan sekarang!</Link>
              </div>
            </div>
            <div className="col-4"></div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  fillCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
