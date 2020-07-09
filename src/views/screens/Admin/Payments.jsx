import React from "react";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class Payments extends React.Component {
  state = {
    paymentList: [],
    paymentStatus: "pending",
  };

  getPaymentList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        _expand: "user",
        _embed: "transactionDetails",
      },
    })
      .then((res) => {
        this.setState({ paymentList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderPayments = () => {
    return this.state.paymentList.map((val) => {
      if (val.status === this.state.paymentStatus)
        return (
          <tr>
            <td> {val.user.username} </td>
            <td> {val.totalPrice} </td>
            {this.state.paymentStatus === "pending" ? (
              <td>
                {" "}
                <ButtonUI
                  onClick={() => this.completeTransactionHandler(val.id)}
                >
                  Complete Transaction
                </ButtonUI>{" "}
              </td>
            ) : null}
          </tr>
        );
    });
  };

  completeTransactionHandler = (id) => {
    Axios.patch(`${API_URL}/transactions/${id}`, {
      status: "completed",
      completedDate: Date.now(),
    })
      .then(() => {
        this.getPaymentList();
      })
      .catch((err) => {
        swal("Error!", "Failed to complete transaction", "error");
      });
  };

  componentDidMount() {
    this.getPaymentList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="dashboard">
              <caption className="p-3">
                <h2>Payments</h2>
              </caption>
              <div className="d-flex flex-row ml-3 mb-3">
                <ButtonUI
                  className={`auth-screen-btn ${
                    this.state.paymentStatus == "pending" ? "active" : null
                  }`}
                  type="outlined"
                  onClick={() => this.setState({ paymentStatus: "pending" })}
                >
                  Pending
                </ButtonUI>
                <ButtonUI
                  className={`ml-3 auth-screen-btn ${
                    this.state.paymentStatus == "completed" ? "active" : null
                  }`}
                  type="outlined"
                  onClick={() => this.setState({ paymentStatus: "completed" })}
                >
                  Completed
                </ButtonUI>
              </div>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Total Price</th>
                    {this.state.paymentStatus === "pending" ? (
                      <th>Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>{this.renderPayments()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Payments;
