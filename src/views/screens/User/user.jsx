import React from "react";
import { Link } from "react-router-dom";
import { fillCart, editPassword, editDataUser } from "../../../redux/actions";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import TextField from "../../components/TextField/TextField";

import ButtonUI from "../../components/Button/Button";

import "./user.css";
import { connect } from "react-redux";
import swal from "sweetalert";

class UserC extends React.Component {

  state = {
    editToggle: {
      profile: false,
      password: false
    },
    profileForm: {
      userrealname: this.props.user.userrealname,
      userphone: this.props.user.userphone,
    },
    passwordForm: {
      password: "",
      newPassword: "",
      showPassword: false
    },
  }

  toggleEdit = (toggle) => {
    this.setState({
      editToggle: {
      ...this.state.editToggle,
      [toggle]: !this.state.editToggle[toggle],
      }
    })
  }

  inputHandler = (e, field, form)=> {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
    console.log(field +": "+ this.state[form][field])
  };

  checkBoxHandler = (e) => {
    const { checked } = e.target;

    this.setState({
      passwordForm: {
        ...this.state.passwordForm,
        showPassword: checked,
      },
    });
  };

  editPasswordBtnHandler = () => {
    let userData = {
      username: this.props.user.username,
      password: this.state.passwordForm.password,
      newPassword: this.state.passwordForm.newPassword
    }
    this.props.editPassword(userData);
  }

  editDataBtnHandler = () => {
    let userData = {
      id: this.props.user.id,
      userrealname: this.state.profileForm.userrealname,
      userphone: this.state.profileForm.userphone
    }
    this.props.editDataUser(userData)
    this.toggleEdit("profile")
  }

  renderProfile() {
    return(
      <div className="profile-box">
        <div className="row">
          <div className="col-4">
            <img src={"https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2016/11/one-pot-paneer-curry-pie.jpg"} 
            alt="" style={{ height: "230px", width: "235px", borderRadius: "10px"}} />
          </div>
          <div className="col">
            <div className="container-fluid">
            {this.renderViewData()}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  renderViewData() {
    return (
      <>
        <h2 className="py-2">
          {this.props.user.username ? (
            this.props.user.username
          ): (
            "Username Kosong"
            )}
        </h2>
        <h5>
        {this.props.user.userrealname ? (
          this.props.user.userrealname
        ) : (
          "nama kosong"
        )}
        </h5>
        <p className="py-1">
          {this.props.user.useremail ? (
            this.props.user.useremail
          ) : (
            "Email"
          )}
        </p>
        <p>
          {this.props.user.userphone ? (
            this.props.user.userphone
          ) : (
            "nomor kosong"
          )}
        </p>
        <p className="mt-1"><strong>Ubah: </strong></p>
        <div className="container row">
          <ButtonUI className="col-3" type="outlined" onClick={(e) => this.toggleEdit("profile")}>data</ButtonUI>
          <ButtonUI className="col-3" type="contained" onClick={(e) => this.toggleEdit("password")}>sandi</ButtonUI>
        </div>
      </>
    )
  }

  renderModalData(){
      return(
        <Modal
          toggle={(e) => this.toggleEdit("profile")} // pemanggil tutup buka
          isOpen={this.state.editToggle.profile} // si trigger buka
          className="modal-login"
        >
          <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("profile")}></ModalHeader>
          <ModalBody>
           <div className="row mb-4">
              <div className="col-auto mr-auto ml-3">
               <h4>Ubah Data</h4>
              </div>
           </div>
           <div>
              <TextField
                value={this.state.profileForm.userrealname}
                onChange={(e) => this.inputHandler(e, "userrealname", "profileForm")} 
                placeholder="nama"
                className="mb-1 login-modal-text"
                />
              <TextField
                value={this.state.profileForm.userphone}
                onChange={(e) => this.inputHandler(e, "userphone", "profileForm")} 
                placeholder="nomor telp."
                className="login-modal-text mt-3"
                />
              <div>
            </div>
            <div className="container row mt-4">
              <ButtonUI className="" type="outlined" onClick={(e) => this.editDataBtnHandler()}>Simpan</ButtonUI>
              <ButtonUI className="" type="contained" onClick={(e) => this.toggleEdit("profile")}>Batal</ButtonUI>
            </div>
            </div>
            <div className="row mt-2">
             <div className="col-auto mr-auto ml-3"></div>
           </div>
          </ModalBody>
        </Modal>
      )
  }

  renderModalPassword(){
      return(
        <Modal
          toggle={(e) => this.toggleEdit("password")} // pemanggil tutup buka
          isOpen={this.state.editToggle.password} // si trigger buka
        >
          <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("password")}></ModalHeader>
          <ModalBody>
           <div className="row mb-4">
              <div className="col-auto mr-auto ml-3">
               <h4>Ubah Kata Sandi</h4>
              </div>
           </div>
           <div>
              <TextField
                onChange={(e) => this.inputHandler(e, "password", "passwordForm")} 
                placeholder="Kata Sandi"
                className="mb-1 login-modal-text"
                type={this.state.passwordForm.showPassword ? "text" : "password"}
                />
              <TextField
                onChange={(e) => this.inputHandler(e, "newPassword", "passwordForm")} 
                placeholder="Kata Sandi Baru"
                className="login-modal-text mt-3"
                type={this.state.passwordForm.showPassword ? "text" : "password"}
                />
              <div className="row container-fluid">
              <input
                  type="checkbox"
                  onChange={(e) => this.checkBoxHandler(e)}
                  name="showPasswordRegister"
                  className="material-icons mt-2"
                  /><p className="pl-1 pt-1">tampilkan kata sandi</p>
              </div>
              <div className="container row mt-4">
                <ButtonUI className="col-3" type="outlined" onClick={(e) => this.editPasswordBtnHandler()}>Simpan</ButtonUI>
                <ButtonUI className="col-3" type="contained" onClick={(e) => this.toggleEdit("password")}>Batal</ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )
  }

  render(){
    return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-1"></div>
        <div className="col-2 py-2 px-1">
          <div className="card sticky-top cardNav">
            <div className="card-header cardNav-header">
              <ButtonUI 
              type="textual"onClick={() => this.setState({ categoryFilter: "" })}
              style={{ color: "inherit", textDecoration: "inherit"}}  
              >
              <h5 className="card-title">PROFILE</h5>
              </ButtonUI>
            </div>
            {/* <Link to="/" style={{ color: "inherit", textDecoration: "inherit"}} > */}
            <ul className="list-group listNav-group-flush">
              <li onClick={() => this.setState({ categoryFilter: "Minuman" })}className="list-group-item ">
              <ButtonUI type="textual">Minuman</ButtonUI>
              </li>
              <li onClick={() => this.setState({ categoryFilter: "Makanan" })} className="list-group-item ">
              <ButtonUI type="textual">Makanan</ButtonUI>
              </li>
              <li onClick={() => this.setState({ categoryFilter: "Tambahan" })} className="list-group-item ">
              <ButtonUI type="textual">Tambahan</ButtonUI>
              </li>
              <li onClick={() => this.setState({ categoryFilter: "Kudapan" })} className="list-group-item ">
              <ButtonUI type="textual">Kudapan</ButtonUI>
              </li>
            </ul>
            {/* </Link> */}
          </div>
        </div>
        <div className="col mt-2">
          {this.renderProfile()}
        </div>
        <div className="col-2"></div>
      </div>
      {this.renderModalData()}
      {this.renderModalPassword()}
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.search
  };
};

const mapDispatchToProps = {
  editPassword, editDataUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserC);
