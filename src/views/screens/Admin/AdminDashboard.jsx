import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";

import { addProduct, getCategory, getProduct, addCategoryToProduct, deleteCategoryFromProduct } from "../../../redux/actions";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    // productList: [
    //   {
    //     id: 0,
    //     productname: "lorem",
    //     productprice: 20000,
    //     category: "Lorem",
    //     image: "https://www.mcdelivery.co.id/id/static/1594710784574/assets/62/products/183037.png?",
    //     desc: "lorem",
    //     sold: 42,
    //   },
    //   {
    //     id: 2,
    //     productname: "lorem",
    //     productprice: 20000,
    //     category: "Lorem",
    //     image: "https://www.mcdelivery.co.id/id/static/1594710784574/assets/62/products/183037.png?",
    //     desc: "lorem",
    //     sold: 142,
    //   }
    // ],
    productList: [],
    categoryList: [],
    createForm: {
      productname: "",
      productprice: 0,
      productdesc: "",
      categoryId: 1,
    },
    editForm: {
      id: 0,
      productname: "",
      categoryId: 1,
      productprice: 0,
      image: "",
      desc: "",
    },
    activeProducts: [
    ],
    toggleOpen: {
      produk: false,
      category: false,
    },
    selectedFile: null,
  };

  componentDidMount() {
    this.props.getProduct();
    this.props.getCategory();
  }

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
    console.log(field,form +": "+ this.state[form][field])
  };

  fileChangeHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
    console.log(this.state.selectedFile)
  };

  addProductHandler = () => {
    let productPict = new FormData();
    let create = this.state.createForm

    productPict.append(
      "file",
      this.state.selectedFile,
    )
    this.props.addProduct(productPict, create)  
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
      modalOpen: true,
    });
  };

  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  editCategoryProductRelationBtnHandler = (fn) => {
    let produkId = this.state.editForm.id
    let cateId = this.state.editForm.categoryId
    this.props[fn](produkId, cateId)
  }
  toggleEdit = (toggle, id) => {
    this.setState({
      toggleOpen: {
      ...this.state.toggleOpen,
      [toggle]: !this.state.toggleOpen[toggle],
      }
    })
    this.setState({editForm: {...this.state.editForm, id: id}})
    console.log(this.state.toggleOpen.category)
  };

  renderNavCard = () => {
    return(
      <div className="card sticky-top cardNav">
              <div className="card-header cardNav-header">
                <ButtonUI 
                type="textual"onClick={() => this.setState({ categoryFilter: "" })}
                style={{ color: "inherit", textDecoration: "inherit"}}  
                >
                <h5 className="card-title">Admin</h5>
                </ButtonUI>
                
              </div>
              {/* <Link to="/" style={{ color: "inherit", textDecoration: "inherit"}} > */}
              <ul className="list-group listNav-group-flush">
                <li onClick={() => console.log(this.props.prdc.category)}className="list-group-item ">
                <ButtonUI type="textual">Minuman</ButtonUI>
                </li>
                <li onClick={() => console.log(this.state.categoryList)} className="list-group-item ">
                <ButtonUI type="textual">Makanan</ButtonUI>
                </li>
                <li onClick={() => console.log(this.props.prdc.product)} className="list-group-item ">
                <ButtonUI type="textual">Tambahan</ButtonUI>
                </li>
                <li onClick={() => this.setState({ categoryFilter: "Kudapan" })} className="list-group-item ">
                <ButtonUI type="textual">Kudapan</ButtonUI>
                </li>
              </ul>
              {/* </Link> */}
            </div>
    )
  }

  renderHeadProductList = () => {
    if (!this.state.toggleOpen.produk) {
      return (
        <>
          <table className="dashboard-table ml">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Terjual</th>
              </tr>
            </thead>
            <tbody>
              {this.renderProductList()}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>muat lebih banyak</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </>
      )
    }
  }

  renderProductList = () => {
    // return this.state.productList.map((val, idx) => {
    return this.props.prdc.product.map((val, idx) => {
      const { id, productname, productprice, sold } = val;
      return (
        <>
        <tr
          onClick={() => {
            if (this.state.activeProducts.includes(idx)) {
              this.setState({
                activeProducts: [
                  ...this.state.activeProducts.filter((item) => item !== idx),
                ],
              });
            } else {
              this.setState({
                activeProducts: [...this.state.activeProducts, idx],
              });
            }
          }}
        >
          <td> {id} </td>
          <td> {productname} </td>
          <td>
            {" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(productprice)}{" "}
          </td>
          <td></td>
          {/* <td></td> */}
        </tr>
        <tr
          className={`collapse-item ${
            this.state.activeProducts.includes(idx) ? "active" : null
          }`}
        >
          <td className="" colSpan={3}>
            {this.viewDataDetail(val,idx)}
          </td>
        </tr>
      </>
      )
    })
  }

  viewDataDetail = (val, idx) => {
    const { id, productimage, productdesc, category } = val;
    return(
      <>
        <div className="d-flex justify-content-around align-items-center">
          <div className="d-flex">
            <img src={productimage} alt="" />
            <div className="d-flex flex-column ml-4 justify-content-center">
              <h6>
                Description:
                <span style={{ fontWeight: "normal" }}>{productdesc}</span>
              </h6>
              <h6>
                Category: 
                {this.viewDataDetailCategory(category)}
              </h6>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="row">
              <ButtonUI
                onClick={(e) => this.editBtnHandler(idx)}
                type= "outlined">
              Ubah
              </ButtonUI>
              <ButtonUI 
                className="" type="outlined"
                onClick={(e) => this.toggleEdit("category", id)}>
                Kategori
              </ButtonUI>
            </div>
            <ButtonUI>
              Hapus
            </ButtonUI>
          </div>
        </div>
      </>
    )
  }

  viewDataDetailCategory = (category) => {
    return category.map((val) => {
      return(
        <>
          <span style={{ fontWeight: "normal" }}>{val.categoryname},</span>
        </>
      )
    })
  }

  renderCategoryList = () => {
    return this.props.prdc.category.map((val, idx) => {
      const { id, categoryname } = val;
      return (
        <option value={id}>{categoryname}</option>
      )
    })
  }
  
  renderAddProduct = () => {
    if (this.state.toggleOpen.produk) {
      return(
        <div className="row my-2">
          <div className="col-8">
            <TextField
            placeholder="Nama Produk"
            onChange={(e) => this.inputHandler(e, "productname", "createForm")}
            />
          </div>
          <div className="col-4">
            <TextField
            placeholder="harga"
            onChange={(e) => this.inputHandler(e, "productprice", "createForm")}
            />
          </div>
          <div className="col-12 mt-3">
            <textarea
             onChange={(e) => this.inputHandler(e, "productdesc", "createForm")}
             style={{ resize: "none" }}
             placeholder="Keterangan"
             className="custom-text-input"
           ></textarea>
          </div>
          <div className="col-6 mt-3">
           <div className="input-group" style={{borderRadius: "25px"}}>
              <div class="custom-file">
                <input onChange={this.fileChangeHandler} type="file" class="custom-file-input customfileinputPROA" id="imageAdd" style={{display: "none"}}/>
                <label class="custom-file-label customfilelabelPROA" for="imageAdd">Choose file</label>
              </div>
            </div>
          {/* <input type="file" onChange={this.fileChangeHandler} /> */}
          </div>
          <div className="col-6 mt-3">
          <select
          value={this.state.createForm.category}
          className="custom-text-input h-100 pl-3"
          onChange={(e) => this.inputHandler(e, "categoryId", "createForm")}
          >{this.renderCategoryList()}</select>
           </div>
           <div className="col-3 mt-3">
            <ButtonUI onClick={this.addProductHandler} type="contained">
             Tambah Produk
            </ButtonUI>
        </div>
      </div>
     )
    }
  }

  renderModalEdit = () => {
    return(
       <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-8">
                <TextField
                  value={this.state.editForm.productname}
                  placeholder="Product Name"
                  onChange={(e) =>
                    this.inputHandler(e, "productname", "editForm")
                  }
                />
              </div>
              <div className="col-4">
                <TextField
                  value={this.state.editForm.productprice}
                  placeholder="Price"
                  onChange={(e) => this.inputHandler(e, "productprice", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.editForm.desc}
                  onChange={(e) => this.inputHandler(e, "desc", "editForm")}
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.image}
                  placeholder="Image Source"
                  onChange={(e) => this.inputHandler(e, "image", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.editForm.category}
                  className="custom-text-input h-100 pl-3"
                  onChange={(e) => this.inputHandler(e, "category", "editForm")}
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Tambahan">Tambahan</option>
                  <option value="Kudapan">Kudapan</option>
                </select>
              </div>
              <div className="col-12 text-center my-3">
                <img src={this.state.editForm.image} alt="" />
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editProductHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
    )
  }

  renderModalAddCategory = () => {
    return(
      <Modal
        toggle={(e) => this.toggleEdit("category")} // pemanggil tutup buka
        isOpen={this.state.toggleOpen.category} // si trigger buka
        className="modal-category"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("category")}></ModalHeader>
        <ModalBody>
         <div className="row mb-4">
            <div className="col-auto mr-auto ml-3">
             <h4>Kategori</h4>
             <p>{this.state.editForm.id}</p>
            </div>
         </div>
         <div>
            <select
              value={this.state.createForm.category}
              className="custom-text-input h-100 pl-3"
              onChange={(e) => this.inputHandler(e, "categoryId", "editForm")}
              >{this.renderCategoryList()}
            </select>
            <div className="container row">
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.editCategoryProductRelationBtnHandler("addCtP")}
              >Tambah</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.editCategoryProductRelationBtnHandler("delCfP")}
              >Hapus</ButtonUI>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
  }

  render() {
    return (
      <div className="container py-1">
        <div className="row">
          <div className="col-2 py-2 px-1 container">
            {this.renderNavCard()}
          </div>
          <div className="col py-2">
            <div className="dashboard">
              <div className="d-flex justify-content-between container customhdbg">
                <caption 
                className={`custom-head ${!this.state.toggleOpen.produk ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEdit("produk")}>
                  <h2>Produk</h2>
                </caption>
                <caption 
                className={`custom-head ${this.state.toggleOpen.produk ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEdit("produk")}>
                  <h2>Tambah Produk</h2>
                </caption>
              </div>
                {this.renderHeadProductList()}
                {this.renderAddProduct()}
            </div>
           {/* bottom of the page */}
          </div>
        </div>     
        {this.renderModalEdit()}
        {this.renderModalAddCategory()}
      </div>
    )}
  }

const mapStateToProps = (state) => {
  return {
    prdc: state.prdc
  };
};

const mapDispatchToProps = {
  addProduct: addProduct,
  getCategory, getProduct,
  addCtP: addCategoryToProduct,
  delCfP: deleteCategoryFromProduct,
};

export default connect(mapStateToProps,mapDispatchToProps)(AdminDashboard);
// export default AdminDashboard;
