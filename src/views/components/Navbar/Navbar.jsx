import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "universal-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import TextField from "../TextField/TextField";
import ButtonUI from "../Button/Button";
import { logoutHandler, navbarInputHandler,loginHandler } from "../../../redux/actions";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    modalOpen: false,
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
  };

  componentDidUpdate() { //this guy check if the cookie added, when it added. we go to render
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  checkBoxHandler = (e) => {
    const { checked } = e.target;

    this.setState({
      loginForm: {
        ...this.state.loginForm,
        showPassword: checked,
      },
    });
  };

  inputHandler = (e, field)=> {
    const { value } = e.target;
    this.setState({
      loginForm: {
        ...this.state.loginForm,
        [field]: value,
      },
    });
  };

  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let User = {
      username,
      password,
    };
    this.props.onLogin(User);
  }

  // modal 
  toggleModal = () => { //untuk tutup/buka modal
    this.setState({modalOpen: !this.state.modalOpen})
  }

  renderModalLogIn(){
    if (!this.props.user.id ) {
      return(
        <Modal
          toggle={this.toggleModal} // pemanggil tutup buka
          isOpen={this.state.modalOpen} // si trigger buka
          className="modal-login"
        >
          <ModalHeader className="modal-login-header" toggle={this.toggleModal}></ModalHeader>
          <ModalBody>
           <div className="row mb-4">
              <div className="col-auto mr-auto ml-3">
               <h4>Masuk</h4>
              </div>
              <div className="col-auto mr-1">
               <ButtonUI type="textual" className="mt-1">
                <Link to="/auth-register">Daftar</Link>
               </ButtonUI>
              </div>
           </div>
           <div>
              {/* <p className="ml-3">Username</p> */}
              <TextField
                value={this.state.loginForm.username}
                onChange={(e) => this.inputHandler(e, "username")} 
                placeholder="Alamat e-mail"
                className="mb-1 login-modal-text"
                />
              {/* <p className="ml-3 mt-">Password</p> */}
              <TextField
                value={this.state.loginForm.password}
                onChange={(e) => this.inputHandler(e, "password")} 
                placeholder="Kata Sandi"
                className="login-modal-text mt-3"
                type={this.state.loginForm.showPassword ? "text" : "password"}
                />
              <input
                  type="checkbox"
                  onChange={(e) => this.checkBoxHandler(e)}
                  name="showPasswordRegister"
                  className="material-icons mt-2"
                  />{" "}tampilkan kata sandi      
              <div>
            </div>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={this.loginBtnHandler}
              >Masuk</ButtonUI>
            </div>
            <div className="row mt-2">
             <div className="col-auto mr-auto ml-3"></div>
            <div className="col-auto mr-1">
               <ButtonUI type="textual" className="mt-1" onClick={this.toggleModal}>
                 <Link to="/reset-password">
                  Lupa Kata Sandi?
                 </Link>
               </ButtonUI>
            </div>
           </div>
           {this.props.user.errMsg ? (
          <div className="row justify-content-center  mt-1">
            <div className="alert alert-danger">
                <p>{this.props.user.errMsg}</p>
            </div>
          </div>  
            ) : null}
          </ModalBody>
        </Modal>
      )
    }
  }

  logoutBtnHandler = () => {
    this.props.onLogout();
  };

  // dropdown
  toggleDropdown = () => { //untuk tutup/buka dropdown
    this.setState({dropdownOpen: !this.state.dropdownOpen})
  }

  renderMenuNav(){
    if (this.props.user.id) {
       return(         
          <>
          <Dropdown
            toggle={this.toggleDropdown}
            isOpen={this.state.dropdownOpen}
          >
            {this.props.user.id ? (this.toggleDropdown) : null}
            <DropdownToggle tag="div" className="d-flex">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
              <p className="small ml-3 mr-4">{this.props.user.username}</p>
            </DropdownToggle>
            <DropdownMenu className="mt-2">
              {this.props.user.role == "admin" ? (
                <>
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/admin-dashboard"
                    >
                      Dashboard
                    </Link>
                  </DropdownItem>
                  <DropdownItem>Members</DropdownItem>
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/admin-payments"
                    >
                      Payments
                    </Link>
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem>Wishlist</DropdownItem>
                  <DropdownItem>
                    <Link to="/history">History</Link>
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
          <Link
            className="d-flex flex-row"
            to="/cart"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <FontAwesomeIcon
              className="mr-2"
              icon={faShoppingCart}
              style={{ fontSize: 24 }}
            />
            <CircleBg>
              <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                {this.props.user.cartItems}
              </small>
            </CircleBg>
          </Link>
          <ButtonUI
            onClick={this.logoutBtnHandler}
            className="ml-3"
            type="textual"
          >
            Logout
          </ButtonUI>
        </>
       )
    } else {
      return (
      <>
        <ButtonUI className="mr-3" type="textual" 
          // onClick={(e) => this.SignInOnBtnHandler("")}
          onClick={(e) => this.toggleModal()}
        >
          Sign in
        </ButtonUI>
        <ButtonUI type="contained">
          <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="/auth-register"
          >
          Sign up
          </Link>
        </ButtonUI>
      </>
      )
    }
  }

  render() {
    return (
      // <div className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="d-flex justify-content-between align-items-center py-2 navbar-container" style={{border: "none"}}>
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onChange={this.props.onChangeSearch}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Cari produk impianmu disini"
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.renderMenuNav()}
        </div> 
        {/* bottom of the page*/}
        {this.renderModalLogIn()}
      </div> 
      // </div>
    );
  }
}





const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onLogout: logoutHandler,
  onChangeSearch: navbarInputHandler,
  onLogin: loginHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
