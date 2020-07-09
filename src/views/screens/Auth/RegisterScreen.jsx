import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";

// actions
import { registerHandler } from "../../../redux/actions";

class RegisterScreen extends React.Component {
  state = {
    registerForm: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      showPassword: false,
    },
  };

  checkBoxHandler = (e)=> {
    const { checked } = e.target;

    console.log(checked);

    this.setState({
      registerForm: {
        ...this.state.registerForm,
        showPassword: checked,
      },
    });
  };

  componentDidUpdate() {
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({
      registerForm: {
        ...this.state.registerForm,
        [field]: value,
      },
    });
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

  renderRegisterComponent(){
    return (
     <div className="card-body">     
      <div className="mt-4">
        
        <h3 className="card-title">Daftar Sekarang</h3>
        <p className="mt-2 card-text row">
          Sudah mendaftar?
          <ButtonUI className="mt-1 ml-1" type="textual">
            <Link to="/auth-login">Masuk</Link>
          </ButtonUI>
        </p>
        <TextField
          value={this.state.registerForm.username}
          onChange={(e) => this.inputHandler(e, "username")}
          placeholder="Username"
          className="mt-4"
        />
        <TextField
          value={this.state.registerForm.email}
          onChange={(e) => this.inputHandler(e, "email")}
          placeholder="Email"
          className="mt-2"
        />
        <TextField
          value={this.state.registerForm.password}
          onChange={(e) => this.inputHandler(e, "password")}
          placeholder="Password"
          className="mt-2"
          type={this.state.registerForm.showPassword ? "text" : "password"}
        />
        <input
          type="checkbox"
          onChange={(e) => this.checkBoxHandler(e)}
          className="mt-3"
          name="showPasswordRegister"
        />{" "}
        Show Password
        <div >
          <ButtonUI
            type="contained"
            onClick={this.registerBtnHandler}
            className="mt-4 auth-wide-btn"
          >
            Register 
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
      <div className="container">
      <div className="col-2 mx-auto logo-text mt-4"> 
        <Link className="" style={{ textDecoration: "none", color: "inherit" }} to="/">
          <h1>LOGO</h1>
        </Link>
      </div>
        <div className="mt-5">
          <div className="col-5 card mx-auto">
            {this.renderRegisterComponent()}
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
  onRegister: registerHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
