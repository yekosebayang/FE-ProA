import { API_URL } from "../../constants/API";
import Axios from "axios";
import swal from "sweetalert";

export const addProduct = (pict, productData) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/products/new`, productData)

    .then((res) => {
      console.log(res.data.id)
      Axios.post(`${API_URL}/products/${res.data.id}/category/${productData.categoryId}`)

      .then((res) => {
        Axios.put(`${API_URL}/products/pict/${res.data.id}`, pict)

        .then((res) => {
          swal("Berhasil!", "Produk "+ productData.productname+ " berhasil ditambah", "success")
          console.log(res.data);
          console.log("berhasil gan")
        })
        .catch((err) => {
          console.log("error upload foto")
          console.log(err.response.data.message)
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

export const getCategory = () => {
  return (dispatch) => {
    Axios.get(`${API_URL}/category`)
    .then((res) => {
      // console.log(res.data)
      dispatch({
        type: "GET_CATEGORY",
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("ERROR CATEGORY");
      console.log(err.response.data.message);
    });
  }
}

export const getProduct = () => {
  return (dispatch) => {
    Axios.get(`${API_URL}/products/all`)
    .then((res) => {
      console.log(res.data)
      dispatch({
        type: "GET_PRODUCT",
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("ERROR PRODUK");
      console.log(err.response.data.message);
    });
  }
}

export const addCategoryToProduct = (productId, cateId) => {
  return (dispatch) => {
    console.log(productId, cateId)
    Axios.post(`${API_URL}/products/${productId}/category/${cateId}`)
    .then((res) => {
      console.log(res.data)
      swal("Berhasil!", "Kategori berhasil ditambahkan ke " + res.data.productname+ "success")
    })
    .catch((err) => {
      console.log("ERROR addCTP");
      console.log(err);
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }
}

export const deleteCategoryFromProduct = (productId, cateId) => {
  return (dispatch) => {
    console.log(productId, cateId)
    Axios.delete(`${API_URL}/products/${productId}/cate/${cateId}/del`)
    .then((res) => {
      console.log(res.data)
      swal("Berhasil!", "Kategori berhasil dihapus dari " + res.data.productname ,"success")
    })
    .catch((err) => {
      console.log("ERROR addCTP");
      console.log(err);
      swal("Gagal!", err.response.data.message ,"error")
      console.log(err.response.data.message);
    });
  }
}