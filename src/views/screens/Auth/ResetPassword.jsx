import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";
import { resetPassword } from "../../../redux/actions";


class ResetPassowrd extends React.Component{
    state = {
        password: "",
        token: "",
        showPassword: false,
    }
    inputHandler = (e) => {
      const { value } = e.target;
      this.setState({password: value});
    };
    
    resetBtnHandler = () => {
      let body = {
        password: this.state.password,
        token: this.props.match.params.token
      }    
      this.props.onReset(body);
    };

    checkBoxHandler = (e) => {
      const { checked } = e.target;
      this.setState({ showPassword: checked, });
    };  

    renderComponent(){
        return (
         <div className="">     
          <div className="mt-4">
            
            <h4 className="">Atur ulang kata sandi</h4>
            <p className="mt-2 row">
            Masukan kata sandi baru anda
            </p>
            <TextField
              value={this.state.email}
              onChange={(e) => this.inputHandler(e, "password")}
              placeholder="kata sandi"
              className="mt-4"
              type={this.state.showPassword ? "text" : "password"}
            />
            <div className="row container-fluid">
              <input
              type="checkbox"
              onChange={(e) => this.checkBoxHandler(e)}
              name="showPasswordRegister"
              className="material-icons mt-2"
              /><p className="pl-1 pt-1">tampilkan kata sandi</p>
            </div>
            <div >
              <ButtonUI
                type="contained"
                onClick={this.resetBtnHandler}
                className="mt-2 mb-2 auth-wide-btn"
              >
                Ubah
              </ButtonUI>
            </div>
          </div>
         </div>
        );
    
      }

    renderErrMsg() {
      console.log(this.props.user.errMsg)
      if (this.props.user.errMsg == "success" ) {
        return(
          <div className="alert alert-success mt-3">
            <p>
              Ubah kata sandi berhasil!{" "}
              <Link to="/auth-login">
                Masuk
              </Link>
            </p>
          </div>
        )
      } else if (this.props.user.errMsg) {
        return(
          <div className="alert alert-danger mt-3">
            <Link to="/">
              terjadi kesalahan!
            </Link>
          </div>
        )
      } else {
        return(null)
      }
    }

    render() {
        if (this.props.user.id > 0) {
          return <Redirect to="/" />;
        }
        return (
          <div className="">
          <div className="col-2 mx-auto logo-text mt-4"> 
            <Link className="" style={{ textDecoration: "none", color: "inherit" }} to="/">
              <h1>LOGO</h1>
            </Link>
          </div>
            <div className="mt-5">
              <div className="col-5 card mx-auto">
                {this.renderComponent()}
                {this.renderErrMsg()}
              </div>
            </div>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = {
  onReset : resetPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassowrd);