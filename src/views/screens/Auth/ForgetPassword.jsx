import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import {Modal, ModalHeader, ModalBody} from "reactstrap";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";
import { forgetPassword } from "../../../redux/actions";


class ForgetPassowrd extends React.Component{
    state = {
        email: "",
        modalOPen: false
    }
      inputHandler = (e) => {
        const { value } = e.target;
        this.setState({email: value});
      };
    
      forgotBtnHandler = () => {
        let email = {
          useremail: this.state.email
        }    
        this.props.onForget(email);
        // if (this.props.user.errMsg == ""){
        //   this.modalControler()
        // }
        // this.modalControler()
      };
    modalControler = () => {
      this.setState({modalOPen: !this.state.modalOPen})
    }

    renderComponent(){
        return (
         <div className="">     
          <div className="mt-4">
            
            <h4 className="">Lupa kata sandi</h4>
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

    renderErrMsg() {
      if (this.props.user.errMsg == "email belum terdaftar!") {
        return(
          <div className="alert alert-danger mt-3">
            <p>
              {this.props.user.errMsg}{" "}
              <Link to="/auth-register">
                Daftar
              </Link>
            </p>
          </div>
        )
      } else if (this.props.user.errMsg) {
        return(
          <div className="alert alert-success mt-3">
            <p>
              tautan untuk mengubah kata sandi untuk username <strong>{this.props.user.errMsg}</strong> sudah dikirim ke alamat email anda!
            </p>
          </div>
        )
      } else {
        return(null)
      }
    }

    renderModalLoading(){
        return(
          <Modal
           // pemanggil tutup buka
            isOpen={this.state.modalOPen} // si trigger buka
            className="modal-login"
          >
            <ModalHeader className="modal-login-header"></ModalHeader>
            <ModalBody>
             <div className="row mb-4">
                <div className="col-auto mr-auto ml-3">
                 <h5>Mengirim...</h5>
                </div>
             </div>
            </ModalBody>
          </Modal>
        )
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
                {/* <button onClick={(e) => this.modalControler()}>dsasa</button> */}
              </div>
            </div>
            {this.renderModalLoading()}
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
  onForget : forgetPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassowrd);