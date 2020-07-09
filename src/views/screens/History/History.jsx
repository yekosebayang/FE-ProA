import React from "react";
import Axios from "axios";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class History extends React.Component {
  state = {
    historyList: [],
    transactionDetailsList: [],
    modalOpen: false,
  };

  getHistoryList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.user.id,
        _embed: "transactionDetails",
        status: "completed",
      },
    })
      .then((res) => {
        this.setState({ historyList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getTransactionDetails = (transactionId) => {
    Axios.get(`${API_URL}/transactionDetails`, {
      params: {
        transactionId,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ transactionDetailsList: res.data, modalOpen: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderPayments = () => {
    return this.state.historyList.map((val) => {
      const date = new Date(val.completedDate);
      return (
        <tr>
          <td>
            {" "}
            {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}{" "}
          </td>
          <td> {val.totalPrice} </td>
          <td>
            {" "}
            <ButtonUI onClick={() => this.getTransactionDetails(val.id)}>
              View Details
            </ButtonUI>{" "}
          </td>
        </tr>
      );
    });
  };

  renderTransactionDetails = () => {
    return this.state.transactionDetailsList.map((val) => {
      const { product, quantity, price } = val;
      const { image, category, productName, desc } = product;

      return (
        <div className="d-flex justify-content-around align-items-center">
          <div className="d-flex">
            <img src={image} alt="" />
            <div className="d-flex flex-column ml-4 justify-content-center">
              <h5>
                {productName} ({quantity})
              </h5>
              <h6 className="mt-2">
                Category:
                <span style={{ fontWeight: "normal" }}> {category}</span>
              </h6>
              <h6>
                Price:
                <span style={{ fontWeight: "normal" }}>
                  {" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(price)}
                </span>
              </h6>
              <h6>
                Description:
                <span style={{ fontWeight: "normal" }}> {desc}</span>
              </h6>
            </div>
          </div>
        </div>
      );
    });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getHistoryList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="dashboard">
              <caption className="p-3">
                <h2>History</h2>
              </caption>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{this.renderPayments()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal
          className="edit-modal"
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Transaction Details</h3>
            </caption>
          </ModalHeader>
          <ModalBody>{this.renderTransactionDetails()}</ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(History);
