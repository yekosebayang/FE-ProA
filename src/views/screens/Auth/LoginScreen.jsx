import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";

// actions
import { loginHandler } from "../../../redux/actions";

class LoginScreen extends React.Component {
  state = {
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    }
  };

  componentDidUpdate() { //this guy check if the cookie added, when it added. we go to render
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

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
  };

  renderLoginComponent(){
    return (
      <div className="card-body">     
      <div className="mt-4">
        <h3 className="card-title">Masuk</h3>
        <p className="mt-2 card-text row">
          Belum mendaftar?
          <ButtonUI className="mt-1 ml-1" type="textual">
            <Link to="/auth-register">Daftar</Link>
          </ButtonUI>
        </p>
        <TextField
          value={this.state.loginForm.username}
          onChange={(e) => this.inputHandler(e, "username")}
          placeholder="Username"
          className="mt-4"
        />
        <TextField
          value={this.state.loginForm.password}
          onChange={(e) => this.inputHandler(e, "password")}
          placeholder="Password"
          className="mt-2"
          type={this.state.loginForm.showPassword ? "text" : "password"}
        />
        <input
          type="checkbox"
          onChange={(e) => this.checkBoxHandler(e)}
          className="mt-3"
          name="showPasswordLogin"
        />{" "}
        Show Password
        <div >
          <ButtonUI
            type="contained"
            onClick={this.loginBtnHandler}
            className="mt-4 auth-wide-btn"
          >
            Masuk
          </ButtonUI>
        </div>
      </div>
     </div>  
    );
  }

  render() {
    if (this.props.user.id > 0) { // then we go to path2
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="col-2 mx-auto logo-text mt-4"> 
        <Link className="" style={{ textDecoration: "none", color: "inherit" }} to="/">
          <h1>LOGO</h1>
        </Link>
      </div>
      <div className="mt-5">
        <div className="col-5 card mx-auto">
          {this.renderLoginComponent()}
        </div>
        {this.props.user.errMsg ? (
        <div className="row justify-content-center  mt-1">
          <div className="alert alert-danger">
              <p>{this.props.user.errMsg}</p>
          </div>
        </div>  
          ) : null}
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
  onLogin: loginHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
