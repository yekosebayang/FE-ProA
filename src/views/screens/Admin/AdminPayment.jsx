import React from "react";
import { connect } from "react-redux";
import "./AdminDashboard.css";

import { Table, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faTrashAlt, faMinusSquare, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalHeader, ModalBody} from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { priceFormatter } from "../../../supports/helpers/formatter";
import { fillCart } from "../../../redux/actions";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class UserPayment extends React.Component {
  state = {
    paymentData: [],
    selectedFile: "",
    selectedTrans: 0,
    selectedTransImage: "",
    message: "-",
    modalOpen: false,
  };

  getPaymentData = () => {
    Axios.get(`${API_URL}/transactions/all`)
      .then((res) => {
        console.log(res.data[0]);
        this.setState({ paymentData: res.data });
        console.log("berhasil gan")
      })
      .catch((err) => {
        console.log(err);
        console.log("gagal gan")
      });
  };

  componentDidMount() {
    this.getPaymentData();
  }

  renderHeadProductList = () => {
    return(
      <>
        <table className="dashboardCart-table">
          <thead>
            <tr>
              <th>No</th>
              <th>userId</th>
              <th>Status</th>
              <th>Total</th>
              <th>Pesan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.renderPaymentData()}</tbody>
        </table>
      </>
    )
  }

  rjcBtnHandler = () => {
    Axios.put(`${API_URL}/transactions/reject/${this.state.selectedTrans}/${this.state.message}`)
    .then((res) => {
      this.getPaymentData()
      this.setState({selectedFile: ""})
      this.setState({message: "-"})
      swal("Berhasil!", "status pembayaran berhasil diubah", "success")
      this.toggleEdit()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  accBtnHandler = () => {
    Axios.put(`${API_URL}/transactions/acc/${this.state.selectedTrans}/${this.state.message}`)
    .then((res) => {
      swal("Berhasil!", "Transaksi sudah diterima", "success")
      
      Axios.get(`${API_URL}/details/acc/${this.state.selectedTrans}`)
      .then((res) =>{ 
        console.log(res.data)
        console.log(this.state.selectedTrans)
        res.data.forEach(val => {
          const {quantity, product} = val
          const {id} = product

          Axios.put(`${API_URL}/products/sold/${id}/${quantity}`)
          .then((res) => {
            // alert("sukss GAN sold")
            
            Axios.put(`${API_URL}/products/stock/${id}/${quantity}`)
          .then((res) => {
            // alert("sukss GAN stock")
          })
          .catch((err) => {console.log(err)})
          })
          .catch((err) => {console.log(err)})
          
        });
      })
      .then((res) => {
        Axios.post(`${API_URL}/invoice/complete/${this.state.selectedTrans}`)
        .then((res) => {console.log(res)
          swal("Berhasil!", "Invoice terkirim, Transaksi sudah diterima", "success")
        .catch((err) => {console.log(err)})
      })
      .catch((err) => {
        console.log(err)
        console.log("error get product")
      })

    })
    .catch((err) => {
      console.log(err)
      console.log("error acc transaksi")
    })
  }
    )}

  toggleModal = (produkId = 0, gambar = "") => {
    this.setState({ modalOpen: !this.state.modalOpen})
    this.setState({ selectedTrans: produkId})
    this.setState({ selectedTransImage: gambar })
  };

  renderPaymentModal = () => {
    return(
      <Modal toggle={(e) => this.toggleModal()} // pemanggil tutup buka
            isOpen={this.state.modalOpen} // si trigger buka
            className="modal-payment"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleModal()}></ModalHeader>
        <ModalBody>
          <h4>Cek Bukti bayar</h4>
            <p>Id Transaksi: {this.state.selectedTrans}</p>
            <img src={this.state.selectedTransImage} alt="" style={{ height: "250px"}} />
            <TextField
                onChange={(e) => this.setState({message: e.target.value})} 
                placeholder="berikan pesan berbeda"
                className="login-modal-text mt-3"
                />
                <button onClick={console.log(this.state.message)}>ss</button>
          <div className="row">
            <ButtonUI className="col mt-3 mx-1 login-modal-btn" type="outlined" onClick={(e) => this.accBtnHandler()}
            >Terima</ButtonUI>
            <ButtonUI className="col mt-3 mx-1 login-modal-btn" type="contained" onClick={(e) => this.rjcBtnHandler()}
            >Tolak</ButtonUI>
          </div>
        </ModalBody>
      </Modal>
        )
  }

  renderPaymentData = () => {
    return this.state.paymentData.map((val, idx) => {
      const { transactionId, totalprice, status, buydate, paydate, 
        shippingaddress, transactionbill, transactiontext, transactioninvoice, user} = val;
      return (
        <tr>
          <td>
            <strong>{idx + 1}</strong>
          </td>
          <td>
            {/* <strong>{id}</strong> */}
          </td>
          <td>
            <div className="container">
                <div>
                  <strong>{status}</strong>
                </div>
            </div>
          </td>
          <td style={{ verticalAlign: "middle" }}>
            <strong>{totalprice}</strong>
          </td>
          <td>
            {/* <strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis aut rerum dolor rem totam. Accusantium, omnis! Obcaecati iure nisi alias exercitationem! Cum iusto ab a suscipit soluta magni? Vitae, animi.</strong> */}
            <strong>{transactiontext}</strong>
          </td>
          <td>
            {/* {status == "sudah" || status == "belum" ? (
              null
            ) : (
              <ButtonUI
              // disabled
              type="outlined"
              onClick={(e) => this.toggleModal(transactionId, transactionbill)}
              >
                Cek
              </ButtonUI>
            )} */}
            {status == "menunggu" ? (
              <ButtonUI
              // disabled
              type="outlined"
              onClick={(e) => this.toggleModal(transactionId, transactionbill)}
              >
                Cek
              </ButtonUI>
            ) : (
              null
            )}
            {/* <ButtonUI
            type="outlined"
            onClick={this.handleClick}
            >
              Bayar
            </ButtonUI>
            <input type="file"
            id="selectImage"
            //  ref={this.state.hiddenFileInput}
             onChange={this.fileChangeHandler}
             style={{display:'none'}} />  */}
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.state.paymentData.length) {
      return (
        <div className="container py-1">
          <div className="row">
            <div className="col py-2">
              <div className="dashboardCart">
                <div className="customhdbg">
                <caption style={{color: "black"}}>
                  <h2 className="py-2 pl-2">Pembayaran</h2>
                </caption>
                </div>
                {this.renderHeadProductList()}
              </div>
            </div>
          </div>
          {this.renderPaymentModal()}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPayment);
