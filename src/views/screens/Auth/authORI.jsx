import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";

// actions
import { registerHandler, loginHandler, signBtnHandler } from "../../../redux/actions";

class AuthScreen extends React.Component {
  state = {
    activePage: "register",
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
    registerForm: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      showPassword: false,
    },
  };

  checkBoxHandler = (e, form) => {
    const { checked } = e.target;

    console.log(checked);

    this.setState({
      [form]: {
        ...this.state[form],
        showPassword: checked,
      },
    });
  };

  componentDidMount() {
    this.setState({activePage: this.props.sign.signValue})
  }

  componentDidUpdate() {
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
    if (this.props.sign.signValue != this.state.activePage) {
      this.setState({activePage: this.props.sign.signValue})
    }
  }

  SignInOnBtnHandler = (value) => {
    this.props.onSignClick(value)
    // alert(value)
  }

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });

    // console.log(e.target);
  };

  registerBtnHandler = () => {
    const { username, fullName, password, email } = this.state.registerForm;
    let newUser = {
      username,
      fullName,
      password,
      email,
    };

    this.props.onRegister(newUser);
  };

  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let newUser = {
      username,
      password,
    };

    this.props.onLogin(newUser);
  };

  renderRegisterComponent(){
    return (
     <div className="card-body">     
      <div className="mt-4">
        <h3 className="card-title">Daftar Sekarang</h3>
        <p className="mt-2 card-text row">
          Sudah punya akun?
          <ButtonUI className="mt-1 ml-1" type="textual">Masuk</ButtonUI>
        </p>
        <TextField
          value={this.state.registerForm.username}
          onChange={(e) => this.inputHandler(e, "username", "registerForm")}
          placeholder="Username"
          className="mt-4"
        />
        <TextField
          value={this.state.registerForm.email}
          onChange={(e) => this.inputHandler(e, "email", "registerForm")}
          placeholder="Email"
          className="mt-2"
        />
        <TextField
          value={this.state.registerForm.password}
          onChange={(e) => this.inputHandler(e, "password", "registerForm")}
          placeholder="Password"
          className="mt-2"
          type={this.state.registerForm.showPassword ? "text" : "password"}
        />
        <input
          type="checkbox"
          onChange={(e) => this.checkBoxHandler(e, "registerForm")}
          className="mt-3"
          name="showPasswordRegister"
        />{" "}
        Show Password
        <div >
          <ButtonUI
            type="contained"
            onClick={this.registerBtnHandler}
            className="mt-4 regis-modal-btn"
          >
            Register 
          </ButtonUI>
        </div>
      </div>
     </div>  
    );
    
  }

  renderLoginComponent(){
    return (
      <div className="mt-5">
        <h3>Log In</h3>
        <p className="mt-4">
          Welcome back.
          <br /> Please, login to your account
        </p>
        <TextField
          value={this.state.loginForm.username}
          onChange={(e) => this.inputHandler(e, "username", "loginForm")}
          placeholder="Username"
          className="mt-5"
        />
        <TextField
          value={this.state.loginForm.password}
          onChange={(e) => this.inputHandler(e, "password", "loginForm")}
          placeholder="Password"
          className="mt-2"
          type={this.state.loginForm.showPassword ? "text" : "password"}
        />
        <input type="checkbox" onChange={(e) => this.checkBoxHandler(e, "loginForm")}
         className="mt-3" name="showPasswordLogin"/>{" "}
         Show Password
        <div className="d-flex justify-content-center">
          <ButtonUI
            onClick={this.loginBtnHandler}
            type="contained"
            className="mt-4"
          >
            Login
          </ButtonUI>
        </div>
      </div>
    );
  }

  renderAuthComponent() {
    const { activePage } = this.state;
    if (activePage == "register") {
      return(
        this.renderRegisterComponent()
      )
    } else {
      return(
        this.renderLoginComponent()
      )
    }
  };

  render() {
    if (this.props.user.id > 0) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="row mt-5">
        <div className="col-7">Picture</div>
          <div className="col-5 card" style={{width: "18rem"}}>
            <div className="d-flex flex-row">
            </div>
            {this.props.user.errMsg ? (
              <div className="alert alert-danger mt-3">
                {this.props.user.errMsg}
              </div>
            ) : null}
            {this.renderAuthComponent()}
          </div>
          {/* <div className="col-7">Picture</div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    sign: state.sign,
  };
};

const mapDispatchToProps = {
  onRegister: registerHandler,
  onLogin: loginHandler,
  onSignClick: signBtnHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
