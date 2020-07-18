import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "universal-cookie";

import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  DropdownDivider,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { faUser, faSignOut, fa } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import TextField from "../TextField/TextField";
import ButtonUI from "../Button/Button";
import { logoutHandler, navbarInputHandler,loginHandler, resetErrmsg, verifEmail, signBtnHandler } from "../../../redux/actions";
import { faSignOutAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    modalOpen: {
      login: false,
      verif: false,
      forgt: false
    },
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
    verifiedChange: this.props.user.verified,
  };

  componentDidMount() {
    if (this.props.user.errMsg != "") {
      this.props.resetErrmsg()
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
    // console.log(field +": "+ this.state.loginForm[field])
  };

  verifBtnHandler = () => {
    const { id, username, useremail} = this.props.user
    let user = {
      id, username, useremail
    }
    this.props.verifEmail(user)
  }

  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let User = {
      username,
      password,
    };
    this.props.onLogin(User);
  }

  toggleModal = (modal)=> {
    this.setState({
      modalOpen: {
        ...this.state.modalOpen,
        [modal]: !this.state.modalOpen[modal],
      },
    });
  };

  renderModalLogIn(){
    if (!this.props.user.id ) {
      return(
        <Modal
          toggle={(e) => this.toggleModal("login")} // pemanggil tutup buka
          isOpen={this.state.modalOpen.login} // si trigger buka
          className="modal-login"
        >
          <ModalHeader className="modal-login-header" toggle={(e) => this.toggleModal("login")}></ModalHeader>
          <ModalBody>
           <div className="row mb-4">
              <div className="col-auto mr-auto ml-3">
               <h4>Masuk</h4>
              </div>
              <div className="col-auto mr-1">
               <ButtonUI type="textual" className="mt-1">
                <Link style={{ color: "inherit", textDecoration: "inherit"}} to="/auth-register">Daftar</Link>
               </ButtonUI>
              </div>
           </div>
           <div>
              <TextField
                onChange={(e) => this.inputHandler(e, "username")} 
                placeholder="Alamat e-mail"
                className="mb-1 login-modal-text"
                />
              <TextField
                onChange={(e) => this.inputHandler(e, "password")} 
                placeholder="Kata Sandi"
                className="login-modal-text mt-3"
                type={this.state.loginForm.showPassword ? "text" : "password"}
                />
              <div className="row container-fluid">
              <input
                  type="checkbox"
                  onChange={(e) => this.checkBoxHandler(e)}
                  name="showPasswordRegister"
                  className="material-icons mt-2"
                  /><p className="pl-1 pt-1">tampilkan kata sandi</p>
              </div>
              <div>
            </div>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={this.loginBtnHandler}
              >Masuk</ButtonUI>
            </div>
            <div className="row mt-2">
             <div className="col-auto mr-auto ml-3"></div>
            <div className="col-auto mr-1">
               <ButtonUI type="textual" className="mt-1" onClick={(e) => this.toggleModal("forgt")}>
                 <Link to="/forgot-password" style={{ color: "inherit", textDecoration: "inherit"}} >
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

  renderModalVerif(){
    // if (!this.props.user.id) {
      return(
        <Modal
          toggle={(e) => this.toggleModal("verif")} // pemanggil tutup buka
          isOpen={this.state.modalOpen.verif} // si trigger buka
          className="modal-login"
        >
          <ModalHeader className="modal-login-header" toggle={(e) => this.toggleModal("verif")}></ModalHeader>
          <ModalBody>
           <div className="row mb-4">
              <div className="col-auto mr-auto ml-3">
               <h4>Verifikasi</h4>
              </div>
           </div>
           <div>
              <div className=" textPreview">
                {this.props.user.useremail}
              </div>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.verifBtnHandler()}
              >Kirim</ButtonUI>
            </div>
            <div className="row mt-2">
             <div className="col-auto mr-auto ml-3"></div>
           </div>
           {this.props.user.errMsg ? (
          <div className="row justify-content-center  mt-1">
            <div className="alert alert-success">
                <p>{this.props.user.errMsg}</p>
            </div>
          </div>  
            ) : null}
          </ModalBody>
        </Modal>
      )
    // }
  }

  logoutBtnHandler = () => {
  const cookieObj = new Cookies();

    this.setState({
      modalOpen: false, 
      loginForm: {
      username: "",
      password: "",
      showPassword: false,
      },
    })
    this.props.onLogout();
  };

  // dropdown
  toggleDropdown = () => { //untuk tutup/buka dropdown
    this.setState({dropdownOpen: !this.state.dropdownOpen})
  }

  renderMenuNav(){
    if (this.props.user.id) {
       return(
        <div className="container">         
          <div className="row">
          <div className="col-4"></div>
          <Dropdown className="col"
            toggle={this.toggleDropdown}
            isOpen={this.state.dropdownOpen}
          >
            {this.props.user.id ? (this.toggleDropdown) : null}
            <DropdownToggle className="" tag="div" >
              <ButtonUI 
                // onClick={this.logoutBtnHandler}
                type="contained"
              >X
              </ButtonUI>
            </DropdownToggle>
            <DropdownMenu right className="mt-3">
              <DropdownItem header>
              <div className="d-flex">
                <h4 classname="mr-1" style={{textAlign:"center"}}>{this.props.user.username}</h4>
              </div>
              </DropdownItem>
              <DropdownItem disabled>
                  <p>{this.props.user.userrealname ? (
                    this.props.user.userrealname
                  ):(
                    "kosong"
                  )}</p>
              </DropdownItem>
              <DropdownItem>
              <div className="d-flex">
                  <h5 className="mr-3">ubah data</h5>
                  <Link className="" to="/user"><FontAwesomeIcon icon={faEdit} style={{ fontSize: 20 }} /> </Link>
                </div>
              </DropdownItem>
              <DropdownItem divider/>
              <DropdownItem >
                <div className="d-flex">
                  <h5 className="mr-5">keluar</h5>
                  <ButtonUI
                  type="textual" 
                  onClick={this.logoutBtnHandler}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: 24 }} /> 
                  </ButtonUI>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          </div>
        </div>
       )
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className=" mr-3"></div>
            {/* bungkus di tombol login */}
            <Link className="col-3 mr-3"
              style={{ textDecoration: "none", color: "inherit" }}>
              <ButtonUI type="outlined" 
                // onClick={(e) => this.SignInOnBtnHandler("")}
                onClick={(e) => this.toggleModal("login")}
              >Masuk
              </ButtonUI> 
            </Link>
            <Link className="col-3 ml-1"
              style={{ textDecoration: "none", color: "inherit" }}
              to="/auth-register">
            <ButtonUI type="contained" // regis
            >Daftar</ButtonUI>
            </Link>
          {/* bungkus di tombol login */}
          </div>
        </div>
      )
    }
  }

  renderVerifAlert(){
    if (this.props.user.id && this.props.user.verified == "belum") {
      return(
        <div className="container">
          <div className="row">
            <div className="col-8 cardVerif">
              <p className="textVerif">Verifikasi akun kamu untuk kenyamanan berbelanja, dan keamanan{" "}
              <Link onClick={(e) => this.toggleModal("verif")}
              style={{ color: "#995900" }}
              >
                Verifikasi
              </Link>
              </p>
              {/* <p>{this.props.user.verified}</p> */}
            </div>
            <div className="col-1"></div>
            {this.renderModalVerif()}
          </div>
        </div>
      )
    }
  }

  renderBarOption(){
    if (this.props.user.id){
      if (this.props.user.userrole == "admin"){
        return(
          <>
          <ButtonUI 
              type="textual"
              className="my-3 mx-2"
            >Dashboard</ButtonUI>
            <ButtonUI 
              type="textual"
              className="my-3 mx-2"
            >Transaksi</ButtonUI>
          </>
        )
      } else {
        return(
          <>
          <Link to="/user-cart"
              style={{ textDecoration: "none", color: "inherit" }}
              type="textual"
              className="my-3 mx-2"
            >
              <ButtonUI type="textual">
                Keranjang
              </ButtonUI>
            </Link>
            <ButtonUI 
              type="textual"
              className="my-3 mx-2"
            >
              <Link to="/user-payment"
              style={{ textDecoration: "none", color: "inherit" }}
              >
                Pembayaran
              </Link>
              </ButtonUI>
          </>
        )
      }

    }
  }

  render() {
    return (
    <div className="container">
      <div className="row" style={{border: "none"}}>
        <div className="col-2 pt-1 logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            <h2>
            LOGO
            </h2>
          </Link>
        </div>
        <div className="col pl-2 pt-1">
          <div className="container">
            <div className="row">
              {this.props.user.id ? (
                <input
                  onChange={this.props.onChangeSearch}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  className={`search-bar ${
                    this.state.searchBarIsFocused ? "active2" : null
                  }`}
                  type="text"
                  placeholder="mau makan apa?"
                />
              ) : (
                <input
                  onChange={this.props.onChangeSearch}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  className={`search-bar ${
                    this.state.searchBarIsFocused ? "active" : null
                  }`}
                  type="text"
                  placeholder="mau makan apa?"
                />
              )}
              {this.renderBarOption()}
            </div>
          </div>
        </div>
        <div className="col-3 pt-1 row align-items-center">
          {this.renderMenuNav()}
        </div>
        {/* bottom of the page*/}
      </div>
        {this.renderVerifAlert()}
        {this.renderModalLogIn()}
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
  onLogout: logoutHandler,
  onChangeSearch: navbarInputHandler,
  onLogin: loginHandler,
  resetErrmsg, verifEmail, signBtnHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
