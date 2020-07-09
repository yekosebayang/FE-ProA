import React from "react";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class Report extends React.Component {
  state = {
    reportType: "user",
    userReportList: [],
    productReportList: [],
  };

  getUserReportList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        status: "completed",
        _expand: "user",
      },
    })
      .then((res) => {
        // console.log(res.data);
        this.setState({ userReportList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProductReportList = () => {
    Axios.get(
      `${API_URL}/transactionDetails?_expand=transaction&_expand=product`
    )
      .then((res) => {
        console.log(
          res.data.filter((trx) => trx.transaction.status === "completed")
        );
        this.setState({ productReportList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderUserReportList = () => {
    let userList = [];

    this.state.userReportList.forEach((val) => {
      let findUserIdx = userList.findIndex(
        (user) => user.username === val.user.username
      );

      if (findUserIdx !== -1) {
        // Check apakah user sudah tertampung
        // Belom ada = -1
        // !== -1 -> sudah ada
        userList[findUserIdx].total += val.totalPrice;
      } else {
        userList.push({
          username: val.user.username,
          total: val.totalPrice,
        });
      }
    });

    return userList.map((val) => {
      return (
        <tr>
          <td>{val.username}</td>
          <td>{val.total}</td>
        </tr>
      );
    });
  };

  renderProductReportList = () => {
    let productList = [];

    this.state.productReportList
      .filter((trx) => trx.transaction.status === "completed")
      .forEach((val) => {
        let findProductIdx = productList.findIndex(
          (item) => item.productName === val.product.productName
        );

        if (findProductIdx !== -1) {
          productList[findProductIdx].total += val.quantity;
        } else {
          productList.push({
            productName: val.product.productName,
            total: val.quantity,
          });
        }
      });

    return productList.map((val) => {
      return (
        <tr>
          <td>{val.productName}</td>
          <td>{val.total}</td>
        </tr>
      );
    });
  };

  componentDidMount() {
    this.getUserReportList();
    this.getProductReportList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="dashboard">
              <caption className="p-3">
                <h2>Report</h2>
              </caption>
              <div className="d-flex flex-row ml-3 mb-3">
                <ButtonUI
                  className={`auth-screen-btn ${
                    this.state.reportType == "user" ? "active" : null
                  }`}
                  type="outlined"
                  onClick={() => this.setState({ reportType: "user" })}
                >
                  User
                </ButtonUI>
                <ButtonUI
                  className={`ml-3 auth-screen-btn ${
                    this.state.reportType == "product" ? "active" : null
                  }`}
                  type="outlined"
                  onClick={() => this.setState({ reportType: "product" })}
                >
                  Product
                </ButtonUI>
              </div>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      {this.state.reportType === "user"
                        ? "Username"
                        : "Product"}
                    </th>
                    <th>
                      {this.state.reportType === "user"
                        ? "Total Spending"
                        : "Total Item Sold"}{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.reportType === "user"
                    ? this.renderUserReportList()
                    : this.renderProductReportList()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Report;
