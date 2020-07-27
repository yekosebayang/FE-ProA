import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import DataTable from "react-data-table-component";
import swal from "sweetalert";

const columns = [
  {
    name: "ID",
    selector: "id",
    sortable: true
  },
  {
    name: "Nama Produk",
    selector: "productname",
    sortable: true
  },
  {
    name: "Harga",
    selector: "productprice",
    sortable: true
  },
  {
    name: "Terjual",
    selector: "productsold",
    sortable: true
  },
  {
    name: "Stok",
    selector: "productstock",
    sortable: true
  },
];

class AdminDashboard extends React.Component {
  state = {
    productList: [],
    categoryList: [],
    paketList: [],
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
    editCategoryForm:{
      id: 0,
      categoryname: ""
    },
    editPaketForm:{
      id: 0,
      paketname: ""
    },
    activeProducts: [
    ],
    toggleOpen: {
      category: false,
      paket: false,
      editProduct: false,
      editCategory: false,
      editPaket: false,
      head: "a",
      newCategory: false,
    },
    nameFilter: "",
    categoryFilter: "",
    pricefilter:{
      max: 9999999999999,
      min: 0,
    },
    selectedFile: null,
    categoryId: 1,
    paketId: 1,
    max: 999999999,
    post: false,
  };

  fungsiSort = (tabel) => {
    const { productList, post } = this.state;
    let sortList = [...productList]
    if (post) {
      sortList.sort((a, b) =>
        a[tabel] > b[tabel] ? 1 : b[tabel] > a[tabel] ? -1 : 0
      );
      this.setState({ productList: sortList });
    } else {
      sortList.sort((a, b) =>
        a[tabel] < b[tabel] ? 1 : b[tabel] > a[tabel] ? -1 : 0
      );
      this.setState({ productList: sortList });
    }
      this.setState({ post: !post });
}

  componentDidMount() {
    this.getProduct();
    this.getCategory();
    this.getPaket();
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

  getPaket = () => {
    Axios.get(`${API_URL}/Paket`)
    .then((res) => {
      this.setState({ paketList: res.data });
      console.log(this.state.paketList)
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

  inputHandler2 = (value, field, form) => {
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
  
  editModalBtnHandler = (form, idx, list, toggle) => {
    this.setState({
      [form]: {
        ...this.state[list][idx],
      }, //dapet id sama category
    });
    this.setState({
      toggleOpen: {
        ...this.state.toggleOpen, [toggle]: !this.state.toggleOpen[toggle]
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

  addPakettoProductHandler = () => {
    let productId = this.state.editForm.id
    let paketId = this.state.paketId
    Axios.post(`${API_URL}/products/${productId}/paket/${paketId}`)
    .then((res) => {
      this.getProduct()
      swal("Berhasil!", res.data.productname +" masuk ke paket" ,"success")
      this.toggleEdit("paket")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
    });
  }

  deletePaketfromProductHandler = () => {
    let productId = this.state.editForm.id
    let paketId = this.state.paketId
    Axios.delete(`${API_URL}/products/${productId}/paket/${paketId}`)
    .then((res) => {
      this.getProduct()
      swal("Berhasil!", "Kategori berhasil dihapus dari " + res.data.productname ,"success")
      this.toggleEdit("paket")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }

  renderModalProductPaket = () => {
    return(
      <Modal
        toggle={(e) => this.toggleEdit("paket")} // pemanggil tutup buka
        isOpen={this.state.toggleOpen.paket} // si trigger buka
        className="modal-Paket"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("paket")}></ModalHeader>
        <ModalBody>
         <div className="row mb-4">
            <div className="col-auto mr-auto ml-3">
             <h4>Paket</h4>
             <p>{this.state.editForm.id}</p>
            </div>
         </div>
         <div>
            <select
              className="custom-text-input h-100 pl-3"
              // onChange={(e) => this.inputHandler(e, "paketId", "editForm")}
              onChange={(e) => this.setState({paketId: e.target.value})}
              >{this.renderPaketList()}
            </select>
            <div className="container row">
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.addPakettoProductHandler()}
              >Tambah</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.deletePaketfromProductHandler()}
              >Hapus</ButtonUI>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
  }

  renderModalProductCategory = () => {
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

  addCategoryBtnHandler = () => {
    Axios.post(`${API_URL}/category/new`, {
      categoryname: this.state.editCategoryForm.categoryname
    })
    .then((res) => {
      this.getCategory()
      swal("Berhasil!", this.state.newCategoryName + "berhasil ditambahkan","success")
      this.toggleEdit("newCategory")
      this.setState({newCategoryName: ""})
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
      this.setState({newCategoryName: ""})
    });
  }

  addPaketBtnHandler = () => {
    Axios.post(`${API_URL}/Paket/new`, {
      paketname: this.state.editPaketForm.paketname
    })
    .then((res) => {
      this.getPaket()
      swal("Berhasil!", this.state.editPaketForm.paketname + "berhasil ditambahkan","success")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }

  editCategoryBtnHandler = (cateId) => {
    const bodyData = {
      categoryname: this.state.editCategoryForm.categoryname
    }
    Axios.put(`${API_URL}/category/edit/${cateId}`,bodyData)
    .then((res) => {
      this.getCategory()
      swal("Berhasil!", bodyData.categoryname + "berhasil diubah","success")
      this.toggleEdit("editCategory")
    })
    .catch((err) => {
      // swal("Gagal!", err.response.data.message ,"error")
      console.log(err);
    });
  }

  editPaketBtnHandler = (paketId) => {
    const bodyData = {
      paketname: this.state.editPaketForm.paketname
    }
    Axios.put(`${API_URL}/Paket/edit/${paketId}`,bodyData)
    .then((res) => {
      this.getPaket()
      swal("Berhasil!", this.state.editPaketForm.paketname + "berhasil diubah","success")
      this.toggleEdit("editPaket")
    })
    .catch((err) => {
      // swal("Gagal!", err.response.data.message ,"error")
      console.log(err);
    });
  }

  deleteCategoryBtnHandler = (cateId) => {
    Axios.delete(`${API_URL}/category/${cateId}`)
    .then((res) => {
      this.getCategory()
      swal("Berhasil!", "category berhasil dihapus","success")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }

  deletePaketBtnHandler = (paketId) => {
    console.log(paketId)
    Axios.delete(`${API_URL}/Paket/${paketId}`)
    .then((res) => {
      this.getCategory()
      swal("Berhasil!", "paket berhasil dihapus","success")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
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
    // console.log(this.state.toggleOpen.category)
  };

  toggleEditHead = (head) => {
    this.setState({toggleOpen: {...this.state.toggleOpen, head: head,}})
 
  }

  renderNavCardCategory= () => {
    return this.state.categoryList.map((val) => {
      const { id, categoryname } = val;
      return (
        <option 
        onClick={() => this.setState({categoryFilter: categoryname})}
        value={id}>{categoryname}</option>
      )
    })
  }

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
              <select className="custom-text-input pl-3" style={{borderRadius: "0px"}} value={this.state.createForm.category}>
                {this.renderNavCardCategory()}
              </select>
              <div className="textPreview"
              style={{borderRadius: "0px 0px 10px 10px"}}
              >
                Paket
              </div>
        
        </div>
        <div>
              <div className="card-header cardNav-header mt-2">
                <h5 className="card-title hovering" 
                onClick={(e) => this.inputHandler2(9999999999, "max", "pricefilter")}
                 >Harga</h5>
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
    if (this.state.toggleOpen.head =="a") {
      return (
        <>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th onClick={(e) => this.fungsiSort("id")}>ID</th>
                <th onClick={(e) => this.fungsiSort("productname")}>Nama Produk</th>
                <th onClick={(e) => this.fungsiSort("productprice")}>Harga</th>
                <th onClick={(e) => this.fungsiSort("productsold")}>Terjual</th>
                <th onClick={(e) => this.fungsiSort("productstock")}>Stok</th>
              </tr>
            </thead>
            <tbody>
              {this.renderProductList()}
            </tbody>
            <tfoot>
            <DataTable
                  title="Data produk"
                  // columns={columns}
                  data={this.state.productList}
                  paginationPerPage="5"
                  paginationRowsPerPageOptions={[5]}
                  pagination
                />
            </tfoot>
          </table>
        </>
      )
    }
  }

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const { id, productname, productprice, productsold, productstock, category } = val;
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
              <td>
                {productsold}
              </td>
              <td>{productstock}</td>
            </tr>
            <tr
              className={`collapse-item ${
                this.state.activeProducts.includes(idx) ? "active" : null
              }`}
            >
              <td className="" colSpan={5}>
                {this.viewDataDetail(val,idx)}
              </td>
            </tr>
          </>
          )
        }
      })
    })
  }

  viewDataDetail = (val, idx) => {
    const { id, productimage, productdesc, category, paket } = val;
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
                Kategori: 
                {this.viewDataDetailCategory(category)}
              </h6>
              <h6>
                Paket: 
                {this.viewDataDetailPaket(paket)}
              </h6>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="row">
              <ButtonUI
                onClick={(e) => this.editModalBtnHandler("editForm", idx, "productList", "editProduct")}
                type= "outlined">
              Ubah
              </ButtonUI>
              <ButtonUI 
                className="" type="outlined"
                onClick={(e) => this.toggleEdit("category", id)}>
                Kategori
              </ButtonUI>
              <ButtonUI 
                className="" type="outlined"
                onClick={(e) => this.toggleEdit("paket", id)}>
                Paket
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

  viewDataDetailPaket = (paket) => {
    return paket.map((val) => {
      return(
        <>
          <span style={{ fontWeight: "normal" }}>{val.paketname},</span>
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

  renderPaketList = () => {
    return this.state.paketList.map((val, idx) => {
      const { id, paketname } = val;
      return (
        <option value={id}>{paketname}</option>
      )
    })
  }
  
  renderCrudCategory = () => {
    if (this.state.toggleOpen.head == "b") {
      return(
        <>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kategori</th>
                <th>Ubah</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderCategoryCrudtList()}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>muat lebih banyak</th>
                <th></th>
                <th>
                </th>
              </tr>
            </tfoot>
          </table>
        </>
      )
    }
  }

  renderCrudPaket = () => {
    if (this.state.toggleOpen.head == "c") {
      return(
        <>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paket</th>
                <th>Ubah</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderPaketCrudtList()}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>muat lebih banyak</th>
                <th></th>
                <th>
                </th>
              </tr>
            </tfoot>
          </table>
        </>
      )
    }
  }

  renderPaketCrudtList = () => {
    return this.state.paketList.map((val, idx) => {
      const { id, paketname} = val;
          return (
            <>
            <tr>
              <td> {id} </td>
              <td> {paketname} </td>
              <td>
                <ButtonUI 
                onClick={(e) => this.editModalBtnHandler("editPaketForm", idx, "paketList", "editPaket")}
                type="textual">
                  Ubah
                </ButtonUI>
              </td>
              <td>
                <ButtonUI 
                onClick={(e) => this.deletePaketBtnHandler(id)}
                type="textual">
                  Hapus
                </ButtonUI>
              </td>
              <td></td>
              <td></td>
            </tr>
          </>
          )
    })
  }

  renderCategoryCrudtList = () => {
    return this.state.categoryList.map((val, idx) => {
      const { id, categoryname} = val;
          return (
            <>
            <tr>
              <td> {id} </td>
              <td> {categoryname} </td>
              <td>
                <ButtonUI 
                onClick={(e) => this.editModalBtnHandler("editCategoryForm", idx, "categoryList", "editCategory")}
                type="textual">
                  Ubah
                </ButtonUI>
              </td>
              <td>
                <ButtonUI 
                onClick={(e) => this.deleteCategoryBtnHandler(id)}
                type="textual">
                  Hapus
                </ButtonUI>
              </td>
              <td></td>
              <td></td>
            </tr>
          </>
          )
    })
  }

  renderAddProduct = () => {
    if (this.state.toggleOpen.head == "d") {
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

  renderModalEditCategory = () => {
    return(
      <Modal
        toggle={(e) => this.toggleEdit("editCategory")} // pemanggil tutup buka
        isOpen={this.state.toggleOpen.editCategory} // si trigger buka
        className="modal-editProduk"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("editCategory")}></ModalHeader>
        <ModalBody>
         <div className="row mb-4">
            <div className="col-auto mr-auto ml-3">
              <h4>Kategori</h4>
               {this.state.editCategoryForm.id}
            </div>
         </div>
        <div>
          <div className="row">
            <div className="col">
              <p>Nama Kategori: </p>
                <TextField
                  value={this.state.editCategoryForm.categoryname}
                  placeholder="Nama Kategori"
                  onChange={(e) => this.inputHandler(e, "categoryname", "editCategoryForm")}
                />
            </div>
          </div>            
            <div className="container row">
                <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.editCategoryBtnHandler(this.state.editCategoryForm.id)}
                >Simpan</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.toggleEdit("editCategory")}
              >Batal</ButtonUI>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
  }

  renderModalEditPaket = () => {
    return(
      <Modal
        toggle={(e) => this.toggleEdit("editPaket")} // pemanggil tutup buka
        isOpen={this.state.toggleOpen.editPaket} // si trigger buka
        className="modal-editPaket"
      >
        <ModalHeader className="modal-login-header" toggle={(e) => this.toggleEdit("editPaket")}></ModalHeader>
        <ModalBody>
         <div className="row mb-4">
            <div className="col-auto mr-auto ml-3">
              <h4>paket</h4>
               {this.state.editPaketForm.id}
            </div>
         </div>
        <div>
          <div className="row">
            <div className="col">
              <p>Nama Kategori: </p>
                <TextField
                  value={this.state.editPaketForm.paketname}
                  placeholder="Nama Kategori"
                  onChange={(e) => this.inputHandler(e, "paketname", "editPaketForm")}
                />
            </div>
          </div>            
            <div className="container row">
                <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.editPaketBtnHandler(this.state.editPaketForm.id)}
                >Simpan</ButtonUI>
              <ButtonUI className="mt-3 login-modal-btn" type="outlined" onClick={(e) => this.toggleEdit("editCategory")}
              >Batal</ButtonUI>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
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
                className={`custom-head ${this.state.toggleOpen.head=="a" ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEditHead("a")}>
                  <h2>Produk</h2>
                </caption>
                <caption 
                className={`custom-head ${this.state.toggleOpen.head=="b" ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEditHead("b")}>
                  <h2>Kategori</h2>
                </caption>
                <caption 
                className={`custom-head ${this.state.toggleOpen.head == "c" ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEditHead("c")}>
                  <h2>Paket</h2>
                </caption>
                <caption 
                className={`custom-head ${this.state.toggleOpen.head == "d" ? "active" : null}
                py-2 pl-2`}
                onClick={(e) => this.toggleEditHead("d")}>
                  <h2>Tambah Produk</h2>
                </caption>
              </div>
              {this.renderHeadProductList()}
              {this.renderAddProduct()}
              {this.renderCrudCategory()}
              {this.renderCrudPaket()}
            </div>
            {this.state.toggleOpen.head == "b" ? (
            <div className="container">
              <div className="row">
                <TextField className="col-8"
                  placeholder="Nama Kategori"
                  onChange={(e) => this.inputHandler(e, "categoryname", "editCategoryForm")}
                  />
                <ButtonUI className="col"
                onClick={(e) => this.addCategoryBtnHandler()}
                >Tambah
                </ButtonUI>
              </div>
            </div>
            ) : null}
            {this.state.toggleOpen.head == "c" ? (
            <div className="container">
              <div className="row">
                <TextField className="col-8"
                  placeholder="Nama Paket"
                  onChange={(e) => this.inputHandler(e, "paketname", "editPaketForm")}
                  />
                <ButtonUI className="col"
                onClick={(e) => this.addPaketBtnHandler()}
                >Tambah
                </ButtonUI>
              </div>
            </div>
            ) : null}
           {/* bottom of the page */}
          </div>
        </div>     
        {this.renderModalEditProduct()}
        {this.renderModalEditCategory()}
        {this.renderModalEditPaket()}
        {this.renderModalProductPaket()}
        {this.renderModalProductCategory()}
      </div>
    )}
  }

export default AdminDashboard;
