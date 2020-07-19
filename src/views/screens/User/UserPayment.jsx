import React from "react";
import { connect } from "react-redux";
import "./user.css";

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
    selectedFile: null,
    selectedTrans: 0,
    hiddenFileInput: null,
    modalOpen: false,
  };

  getPaymentData = () => {
    Axios.get(`${API_URL}/transactions/user/${this.props.user.id}`)
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

  fileChangeHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
    console.log(this.state.selectedFile)
  };

  handleClick = () => {
    document.getElementById("selectImage").click()
  }

  payBtnHandler = () => {
    let paymentPict = new FormData();
    paymentPict.append("file", this.state.selectedFile,)

    Axios.put(`${API_URL}/transactions/payment/${this.state.selectedTrans}`, 
    paymentPict)
    .then((res) => {
      this.getPaymentData()
      swal("Berhasil!", "Bukti bayar berhasil di unggah", "success")
      this.setState({selectedFile: null})
      this.toggleModal()
    })
    .catch((err) => {
      console.log(err)
      swal("Gagal!", "Bukti bayar belum di pilih", "warning")

      // alert(err.response.data.message)
    })
  }

  toggleModal = (produkId = 0) => {
    this.setState({ modalOpen: !this.state.modalOpen})
    this.setState({ selectedTrans: produkId})
  };

  renderPaymentModal = () => {
    return(
      <Modal toggle={(e) => this.toggleModal()} // pemanggil tutup buka
            isOpen={this.state.modalOpen} // si trigger buka
            className="modal-payment"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleModal()}></ModalHeader>
        <ModalBody>
          <h4>Unggah Bukti bayar</h4>
            <p>Id Transaksi: {this.state.selectedTrans}</p>
          <div class="custom-file">
              <input onChange={this.fileChangeHandler} type="file" class="custom-file-input customfileinputPROA" id="imageAdd" style={{display: "none"}}/>
              <label class="custom-file-label customfilelabelPROA" for="imageAdd">Pilih file</label>
          </div>
          <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.payBtnHandler()}
          >Kirim</ButtonUI>
        </ModalBody>
      </Modal>
        )
  }

  renderPaymentData = () => {
    console.log(this.state.paymentData)
    return this.state.paymentData.map((val, idx) => {
      const { transactionId, totalprice, status, buydate, paydate, 
        shippingaddress, transactionbill, transactiontext, transactioninvoice, user} = val;
        
      return (
        <tr>
          <td>
            <strong>{idx + 1}</strong>
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
            {status != "belum" ? (
              null
            ) : (
              <ButtonUI
              disabled
              type="outlined"
              onClick={(e) => this.toggleModal(transactionId)}
              >
                Bayar
              </ButtonUI>
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
                  <h2 ClassName="py-2 pl-2">Pembayaran</h2>
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
