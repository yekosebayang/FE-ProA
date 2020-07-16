import { API_URL } from "../../constants/API";
import Axios from "axios";
import swal from "sweetalert";

export const addProduct = (pict, productData) => { //local
  console.log(pict)
  console.log("pict")
  return (dispatch) => {
    Axios.post(`${API_URL}/products/new`, productData)

    .then((res) => {
      console.log(res.data.id)
      Axios.post(`${API_URL}/products/${res.data.id}/category/${productData.categoryId}`)

      .then((res) => {
        Axios.put(`${API_URL}/products/pict/${res.data.id}`, pict)

        .then((res) => {
          swal("Berhasil!", "Produk "+ productData.productname+ " berhasil ditambah", "success")
          
        })
        .catch((err) => {
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
  }
}

export const addCategoryToProduct = (productId, cateId) => { //local
  return (dispatch) => {
    console.log(productId, cateId)
    Axios.post(`${API_URL}/products/${productId}/category/${cateId}`)
    .then((res) => {

      swal("Berhasil!", "Kategori berhasil ditambahkan ke " + res.data.productname+ "success")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
    });
  }
}

export const deleteCategoryFromProduct = (productId, cateId) => {
  return (dispatch) => {
    console.log(productId, cateId)
    Axios.delete(`${API_URL}/products/${productId}/cate/${cateId}/del`)
    .then((res) => {
      
      swal("Berhasil!", "Kategori berhasil dihapus dari " + res.data.productname ,"success")
    })
    .catch((err) => {
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }
}

export const editProduct = (productData, pict) => { //local
  console.log(pict)
  return (dispatch) => {
    Axios.put(`${API_URL}/products/edit/${productData.id}`, productData)
    .then((res) => {
      console.log(res.data.productname)

      Axios.put(`${API_URL}/products/pict/${productData.id}`, pict)

        .then((res) => {
          swal("Berhasil!", "Produk "+ productData.productname+ " berhasil diubahh", "success")
          
        })
        .catch((err) => {
          swal("Perhatian!", "Produk "+ productData.productname+ " berhasil diubah, foto tidak di ubah", "warning")
          
        })
    })
    .catch((err) => {
      console.log("ERROR put");
      console.log(err.response.data.message);
    });
  }
}

export const deleteProduct = (nama, produkId) => { //local
  return (dispatch) => {
    Axios.delete(`${API_URL}/products/${produkId}`)
    .then((res) => {
      console.log(res.data.productname)
      swal("Berhasil!", "Produk "+nama+" berhasil dihapus", "success")
    })
    .catch((err) => {
      console.log(err.response.data.message);
    });
  }
}