import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";


class ResetPassowrd extends React.Component{
    state = {
        email: ""
    }

    componentDidUpdate() {
        if (this.props.user.id) {
          const cookie = new Cookies();
          cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
        }
      }
    
      inputHandler = (e) => {
        const { value } = e.target;
        this.setState({email: value});
      };
    
      forgotBtnHandler = () => {    
        this.props.onRegister(this.state.email);
      };

    renderRegisterComponent(){
        return (
         <div className="">     
          <div className="mt-4">
            
            <h4 className="">Atur ulang kata sandi</h4>
            <p className="mt-3 row">
            Masukkan Email yang terdaftar. <br/>
            Kami akan mengirimkan tautan untuk mengubah kata sandi anda
            </p>
            <TextField
              value={this.state.email}
              onChange={(e) => this.inputHandler(e, "email")}
              placeholder="Email"
              className="mt-4"
            />
            <div >
              <ButtonUI
                type="contained"
                onClick={this.forgotBtnHandler}
                className="mt-2 mb-2 auth-wide-btn"
              >
                Kirim
              </ButtonUI>
            </div>
          </div>
         </div>
        );
    
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
                {this.props.user.errMsg ? (
                  <div className="alert alert-danger mt-3">
                    {this.props.user.errMsg}
                  </div>
                ) : null}
                {this.renderRegisterComponent()}
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

export default connect(mapStateToProps)(ResetPassowrd);