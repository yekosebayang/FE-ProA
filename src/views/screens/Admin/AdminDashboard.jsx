import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";

import { addProduct, addCategoryToProduct, deleteCategoryFromProduct, editProduct, deleteProduct } from "../../../redux/actions";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productList: [],
    categoryList: [],
    createForm: {
      productname: "",
      productprice: 0,
      productstock: 0,
      productdesc: "",
      categoryId: 1,
    },
    editForm: {
      id: 0,
      productname: "",
      productprice: 0,
      productstock: 0,
      productdesc: "",
    },
    activeProducts: [
    ],
    toggleOpen: {
      produk: false,
      category: false,
      editProduct: false,
    },
    nameFilter: "",
    categoryFilter: "",
    pricefilter:{
      max: 9999999999999,
      min: 0,
    },
    selectedFile: null,
    categoryId: 1,
    max: 999999999,
  };

  componentDidMount() {
    this.getProduct();
    this.getCategory();
    // this.inputPriceFilter();
  }

  getCategory = () => {
      Axios.get(`${API_URL}/category`)
      .then((res) => {
        this.setState({ categoryList: res.data });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }
  
  getProduct = () => {
      Axios.get(`${API_URL}/products/all`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
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
  
  editModalBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
    });
    this.setState({
      toggleOpen: {
        ...this.state.toggleOpen, editProduct: !this.state.toggleOpen.editProduct
      }
    })
  };
  
  addProductHandler = () => {
    let productPict = new FormData();
    let productData = this.state.createForm

    productPict.append(
      "file",
      this.state.selectedFile,
    )

    Axios.post(`${API_URL}/products/new`, productData)

    .then((res) => {
      console.log(res.data.id)
      Axios.post(`${API_URL}/products/${res.data.id}/category/${productData.categoryId}`)

      .then((res) => {
        Axios.put(`${API_URL}/products/pict/${res.data.id}`, productPict)

        .then((res) => {
          this.getProduct()
          swal("Berhasil!", "Produk "+ productData.productname+ " berhasil ditambah", "success")
        })
        .catch((err) => {
          this.getProduct()
          swal("Perhatian!", "Produk "+ productData.productname+ " berhasil ditambah, foto tidak didaftarkan", "warning")
        })
      })
      .catch((err) => {
        console.log("error kategori");
        console.log(err.response.data.message);
      });   
    })
    .catch((err) => {
      console.log("ERROR");
      console.log(err.response.data.message);
    });
  };

  editProductBtnHandler = (produkId) => {
    let productPict = new FormData();
    productPict.append("file", this.state.selectedFile,)

    this.setState({editForm: {...this.state.editForm, id: produkId} })
    let productData = this.state.editForm
    Axios.put(`${API_URL}/products/edit/${productData.id}`, productData)
    .then((res) => {
      console.log(res.data.productname)

      Axios.put(`${API_URL}/products/pict/${productData.id}`, productPict)

        .then((res) => {
          this.getProduct()
          swal("Berhasil!", "Produk "+ productData.productname+ " berhasil diubahh", "success")
          this.toggleEdit("editProduct")
        })
        .catch((err) => {
          this.getProduct()
          swal("Perhatian!", "Produk "+ productData.productname+ " berhasil diubah, foto tidak di ubah", "warning")
          this.toggleEdit("editProduct")
        })
    })
    .catch((err) => {
      console.log("ERROR put");
      console.log(err.response.data.message);
    });
    this.getProduct();
  }
  
  addCategorytoProductHandler = () => {
    let productId = this.state.editForm.id
    let cateId = this.state.categoryId
    Axios.post(`${API_URL}/products/${productId}/category/${cateId}`)
    .then((res) => {
      this.getProduct()
      swal("Berhasil!", "Kategori berhasil ditambahkan ke " + res.data.productname+ "success")
      this.toggleEdit("category")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
    });
  }

  deleteCategoryfromProductHandler = () => {
    let productId = this.state.editForm.id
    let cateId = this.state.categoryId
    Axios.delete(`${API_URL}/products/${productId}/cate/${cateId}`)
    .then((res) => {
      this.getProduct()
      swal("Berhasil!", "Kategori berhasil dihapus dari " + res.data.productname ,"success")
      this.toggleEdit("category")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }

  deleteProductBtnHandler = (name, id) => {
    Axios.delete(`${API_URL}/products/${id}`)
    .then((res) => {
      console.log(res.data.productname)
      this.getProduct()
      swal("Berhasil!", "Produk "+name+" berhasil dihapus", "success")
    })
    .catch((err) => {
      console.log(err.response.data.message);
    });
  }

  toggleEdit = (toggle, id = 1) => {
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
        <div>
              <div className="card-header cardNav-header">
                <ButtonUI 
                type="textual"onClick={() => this.setState({ categoryFilter: "" })}
                style={{ color: "inherit", textDecoration: "inherit"}}  
                >
                <h5 className="card-title">Menu</h5>
                </ButtonUI>
                
              </div>
              {/* <Link to="/" style={{ color: "inherit", textDecoration: "inherit"}} > */}
              <ul className="list-group listNav-group-flush">
                <li onClick={() => this.setState({categoryFilter: "minuman"})}className="list-group-item ">
                <ButtonUI type="textual">Minuman</ButtonUI>
                </li>
                <li onClick={() => this.setState({categoryFilter: "makanan"})} className="list-group-item ">
                <ButtonUI type="textual">Makanan</ButtonUI>
                </li>
                <li onClick={() => this.setState({categoryFilter: "tambahan"})} className="list-group-item ">
                <ButtonUI type="textual">Tambahan</ButtonUI>
                </li>
                <li onClick={() => this.setState({categoryFilter: "kudapan"})} className="list-group-item ">
                <ButtonUI type="textual">Kudapan</ButtonUI>
                </li>
              </ul>
              {/* </Link> */}
        </div>
        <div>
              <div className="card-header cardNav-header mt-2">
              <ButtonUI 
                type="textual"onClick={(_) => this.setState({ priceFilter: {...this.state.pricefilter, max: this.state.max} })}
                style={{ color: "inherit", textDecoration: "inherit"}}  
                >
                <h5 className="card-title">Harga</h5>
                </ButtonUI>
              </div>
              <div className="">
                <TextField 
                onChange={(e) => this.inputHandler(e, "min", "pricefilter")}
                className="pricefiltermin"
                placeholder="Harga Min"
                // placeholder={this.state.pricefilter.min}
                >test</TextField>
                <TextField 
                onChange={(e) => this.inputHandler(e, "max", "pricefilter")}
                className="pricefiltermax"
                // placeholder={this.state.pricefilter.max}
                placeholder="Harga Maks"
                >test</TextField>
              </div>
        </div>
        <div>
              <div className="card-header cardNav-header mt-2">
                <ButtonUI 
                type="textual"onClick={() => this.setState({ nameFilter: "" })}
                style={{ color: "inherit", textDecoration: "inherit"}}  
                >
                <h5 className="card-title">Cari</h5>
                </ButtonUI>    
              </div>
              <div className="">
                <TextField 
                onChange={(e) => this.setState({ nameFilter: e.target.value })}
                className="pricefiltermax"
                placeholder="Nama Produk"
                >test</TextField>
              </div>
        </div>
      </div>            
    )
  }

  renderHeadProductList = () => {
    if (!this.state.toggleOpen.produk) {
      return (
        <>
          <table className="dashboard-table">
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

  renderProductListCategory = () => {
    return this.state.productList.map((val, idx) => {
      const { id, productname, productprice, sold, category } = val;
      return category.map((val2) => {
        
        if (val2.categoryname.toLowerCase().includes(this.state.categoryFilter.toLowerCase()) 
        && productprice <= this.state.pricefilter.max && productprice >= this.state.pricefilter.min
        && productname.toLowerCase().includes(this.state.nameFilter.toLowerCase())
        )
        {
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
        }
      })
    })
  }

  renderProductListNormal = () => {
    return this.state.productList.map((val, idx) => {
      const { id, productname, productprice, sold, category } = val;
      if (productprice <= this.state.pricefilter.max && productprice >= this.state.pricefilter.min
        && productname.toLowerCase().includes(this.state.nameFilter.toLowerCase())
      )
      { 
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
        }
    })
  }

  renderProductList = () => {
    if (this.state.categoryFilter != ""){
      return (
        <>
          {this.renderProductListCategory()}
        </>
      )
    } else {
      return (
        <>
          {this.renderProductListNormal()}
        </>
      )
    }
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
                onClick={(e) => this.editModalBtnHandler(idx)}
                type= "outlined">
              Ubah
              </ButtonUI>
              <ButtonUI 
                className="" type="outlined"
                onClick={(e) => this.toggleEdit("category", id)}>
                Kategori
              </ButtonUI>
            </div>
            <ButtonUI onClick={(e) => this.deleteProductBtnHandler(val.productname, id)}>
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
    return this.state.categoryList.map((val, idx) => {
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
          <TextField
              placeholder="desc"
              onChange={(e) => this.inputHandler(e, "productdesc", "createForm")}
            />
          </div>
          <div className="col-3 mt-3">
           <div className="input-group" style={{borderRadius: "25px"}}>
              <div class="custom-file">
                <input onChange={this.fileChangeHandler} type="file" class="custom-file-input customfileinputPROA" id="imageAdd" style={{display: "none"}}/>
                <label class="custom-file-label customfilelabelPROA" for="imageAdd">Choose file</label>
              </div>
            </div>
          </div>
          <div className="col-3 mt-3">
            <TextField
              placeholder="stock"
              onChange={(e) => this.inputHandler(e, "productstock", "createForm")}
            />
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

  renderModalEditProduct = () => {
    return(
      <Modal
        toggle={(e) => this.toggleEdit("editProduct")} // pemanggil tutup buka
        isOpen={this.state.toggleOpen.editProduct} // si trigger buka
        className="modal-editProduk"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("editProduct")}></ModalHeader>
        <ModalBody>
         <div className="row mb-4">
            <div className="col-auto mr-auto ml-3">
             <h4>Ubah Produk</h4>
             {this.state.editForm.id}
            </div>
         </div>
        <div>
          <div className="row">
            <div className="col">
              <p>Nama Produk: </p>
              <TextField
                value={this.state.editForm.productname}
                placeholder="Nama Produk"
                onChange={(e) => this.inputHandler(e, "productname", "editForm")}
              />
            </div>
            <div className="col">
              <p className="mt-1">Harga Produk: </p>
              <TextField
                value={this.state.editForm.productprice}
                placeholder="Harga Produk"
                onChange={(e) => this.inputHandler(e, "productprice", "editForm")}
              />
            </div>
          </div>
            <p className="mt-1">Keterangan Produk: </p>
            <TextField
              value={this.state.editForm.productdesc}
              placeholder="Keterangan Produk"
              onChange={(e) => this.inputHandler(e, "productdesc", "editForm")}
            />
            <div className="row">
              <div className="col">
                <p className="mt-1">Foto Produk: </p>
                <div className="input-group" style={{borderRadius: "25px"}}>
                  <div class="custom-file">
                    <input onChange={this.fileChangeHandler} type="file" class="custom-file-input customfileinputPROA" id="imageAdd" style={{display: "none"}}/>
                    <label class="custom-file-label customfilelabelPROA" for="imageAdd">Pilih Foto</label>
                  </div>
                </div>
              </div>
              <div className="col">
                <p className="mt-1">Stok Produk: </p>
                <TextField className="col"
                value={this.state.editForm.productstock}
                placeholder="Stock Produk"
                onChange={(e) => this.inputHandler(e, "productstock", "editForm")}></TextField>
              </div>
            </div>
            <div className="container row">
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.editProductBtnHandler(this.state.editForm.id)}
              >Simpan</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.toggleEdit("editProduct")}
              >Batal</ButtonUI>
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
              // onChange={(e) => this.inputHandler(e, "categoryId", "editForm")}
              onChange={(e) => this.setState({categoryId: e.target.value})}
              >{this.renderCategoryList()}
            </select>
            <div className="container row">
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.addCategorytoProductHandler()}
              >Tambah</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.deleteCategoryfromProductHandler()}
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
        {this.renderModalEditProduct()}
        {this.renderModalAddCategory()}
      </div>
    )}
  }

export default AdminDashboard;
