import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Base_ from "./views/screens/Home/base";
import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import Cart from "./views/screens/Cart/Cart";
import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import { userKeepLogin, cookieChecker } from "./redux/actions";
import Payments from "./views/screens/Admin/Payments";
import PageNotFound from "./views/screens/PageNotFound";
import History from "./views/screens/History/History";
import Report from "./views/screens/Admin/Report";
import ResetPassowrd from "./views/screens/Auth/ResetPassword";
import RegisterScreen from "./views/screens/Auth/RegisterScreen";
import LoginScreen from "./views/screens/Auth/LoginScreen";

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
    if (this.props.user.role === "admin") {
      return (
        <>
          <Route exact path="/admin-dashboard" component={AdminDashboard} />
          <Route exact path="/admin-payments" component={Payments} />
          <Route exact path="/admin-report" component={Report} />
        </>
      );
    }
  };

  renderProtectedRoutes = () => {
    if (this.props.user.id) {
      return (
        <>
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/history" component={History} />
        </>
      );
    }
  };

  renderSingleScreen = () => {
    return (
      <>
       <Switch>
          <Route exact path="/reset-password" component={ResetPassowrd} />
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
            <Route exact path="/" component={Base_} />
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
        window.location.pathname === "/cart" || window.location.pathname === "/history" ||
        window.location.pathname === "/admin-dashboard" || window.location.pathname === "/admin-payment"
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
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));