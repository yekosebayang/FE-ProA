import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";

// actions
import { registerHandler, resetErrmsg } from "../../../redux/actions";

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
  
  componentDidMount() {
    if (this.props.user.errMsg != "") {
      this.props.resetErrmsg()
    }
  }

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
      // email, //3000
      useremail: email, //8081 
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
            <Link style={{ color: "inherit", textDecoration: "inherit"}} to="/auth-login">Masuk</Link>
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
          <h1 className="logo-text">FOOD</h1>
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
  resetErrmsg
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
