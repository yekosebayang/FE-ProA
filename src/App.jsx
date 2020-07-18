import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import BaseC from "./views/screens/Home/base";
import Navbar from "./views/components/Navbar/Navbar";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import Cart from "./views/screens/Cart/Cart";
import User from "./views/screens/User/user";
import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import { userKeepLogin, cookieChecker, resetErrmsg, signBtnHandler } from "./redux/actions";
import Payments from "./views/screens/Admin/AdminPayment";
import PageNotFound from "./views/screens/PageNotFound";
import History from "./views/screens/History/History";
import Report from "./views/screens/Admin/Report";
import RegisterScreen from "./views/screens/Auth/RegisterScreen";
import LoginScreen from "./views/screens/Auth/LoginScreen";
import ForgetPassword from "./views/screens/Auth/ForgetPassword";
import ResetPassword from "./views/screens/Auth/ResetPassword";
import UserPayment from "./views/screens/User/UserPayment";

const cookieObj = new Cookie();

class App extends React.Component {

  componentDidMount() {
    let cookieResult = cookieObj.get("authData", { path: "/" });
    if (cookieResult) {
      this.props.keepLogin(cookieResult);
    } else {
      this.props.cookieChecker();
    }
  }

  renderAdminRoutes = () => {
    if (this.props.user.userrole === "admin") {
      return (
        <>
          <Route exact path="/admin-dashboard" component={AdminDashboard} />
          <Route exact path="/admin-payment" component={Payments} />
          <Route exact path="/admin-report" component={Report} />
          <Route exact path="/admin-dashboard" component={AdminDashboard} />
        </>
      );
    }
  };

  renderProtectedRoutes = () => {
    if (this.props.user.id) {
      return (
        <>
          <Route exact path="/user" component={User}/>
          <Route exact path="/user-cart" component={Cart} />
          <Route exact path="/user-payment" component={UserPayment} />
          <Route exact path="/history" component={History} />
        </>
      );
    }
  };

  renderSingleScreen = () => {
    return (
      <>
       <Switch>
          <Route exact path="/forgot-password" component={ForgetPassword} />
          <Route exact path="/reset-password/:token" component={ResetPassword} />
          <Route exact path="/auth-register" component={RegisterScreen} />
          <Route exact path="/auth-login" component={LoginScreen} />
        </Switch>
          <div style={{ height: "120px" }} />
      </>
    )
  }

  renderNavbarScreen = () => {
    return (
      <>          
        <Navbar />
          <Switch>
            <Route exact path="/" component={BaseC} />
            {/* <Route exact path="/user" component={User}/> */}
            {/* <Route exact path="/" component={Home} /> */}
            <Route exact path="/product/:productId" component={ProductDetails} />
            {this.renderAdminRoutes()}
            {this.renderProtectedRoutes()}
            <Route path="*" component={PageNotFound} />
          </Switch>
          <div style={{ height: "120px" }} />
          </>  
    )
  }
  render() {
    if (this.props.user.cookieChecked) {
      return (
      <>
        {
        window.location.pathname === "/" || window.location.pathname === "/product/:productId" ||
        window.location.pathname === "/user-cart" || window.location.pathname ==="/user-payment" ||
         window.location.pathname === "/history" ||
        window.location.pathname === "/admin-dashboard" || window.location.pathname === "/admin-payment" ||
         window.location.pathname === "/admin-payment" ||
        window.location.pathname ==="/user"
        ? (
          this.renderNavbarScreen()       
          ) : (
          this.renderSingleScreen()
        )}
      </>
      );
    } 
    else {
      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    sign: state.sign,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker, resetErrmsg, signBtnHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));