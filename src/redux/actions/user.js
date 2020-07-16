import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import swal from "sweetalert";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;

    Axios.get(`${API_URL}/users`, {
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        console.log(res.data.username) 
        // if (res.data.username == username) { // 8081
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data, 
          });
          cookieObj.set("authData", JSON.stringify(res.data), { path: "/" });
          // Axios.get(`${API_URL}/carts`, {
          //   params: {
          //     userId: res.data[0].id,
          //   },
          // })
          //   .then((res) => {
          //     dispatch({
          //       type: "FILL_CART",
          //       payload: res.data.length,
          //     });
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        // } else {
        //   dispatch({
        //     type: ON_LOGIN_FAIL,
        //     payload: "Username atau password salah",
        //   });
        // }
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: err.response.data.message, //No value present == userr ga kedaftar
        });
      });
      
  };
};

// export const loginHandler = (userData) => { //8081
//   if (userData.username == "" || userData.password == "") {
//     return (dispatch) => {
//       dispatch({
//         type: ON_LOGIN_FAIL,
//         payload: "Data harus diisi!",
//       });
//     }
//   } else {
//     return (dispatch) => {
//       // const { username, password } = userData;
//       Axios.get(`${API_URL}/users/login`,
//       userData)
//         .then((res) => {
//           dispatch({
//             type: ON_LOGIN_SUCCESS,
//             payload: res.data, //8081
//           });
//         })
//         .catch((err) => {
//           console.log(err.response);
//           if (err.response.data.message == "No value present") {
//             dispatch({
//               type: ON_LOGIN_FAIL,
//               payload: "Username belum terdaftar!",
//             });
//           } else {
//             dispatch({
//               type: ON_LOGIN_FAIL,
//               payload: err.response.data.message,
//             });
//           }
//         });  
//     };
//   }
// };

export const userKeepLogin = (userData) => { //8081
  return (dispatch) => {
    Axios.get(`${API_URL}/users/${userData.id}`)
      .then((res) => {
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data
        })
        .catch((err) => {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: err.response.data.message
          })
        })
      }) 
  }
}

export const logoutHandler = () => {
  cookieObj.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => { //8081
  // console.log(userData.username)
  if (userData.username == "" || userData.email == "" || userData.password == ""){
    return (dispatch) => {
      dispatch({
        type: "ON_REGISTER_FAIL",
        payload: "data harus diisi!",
      });
    }
  } else {
    return (dispatch) => {
      Axios.post(`${API_URL}/users/new`,
      {...userData,
      userrole:"user", 
      verified:"belum"})
      .then((res) => {
        console.log(res)
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
          // Axios.get(`${API_URL}/carts`, {
          //   params: {
          //     userId: res.data.id,
          //     },
          //   })
          //   .then((res) => {
          //     dispatch({
          //       type: "FILL_CART",
          //       payload: res.data.length,
          //     });
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
      })
     .catch((err) => {
        console.log(err.response.data.message);
        dispatch({
          type: "ON_REGISTER_FAIL",
          payload: err.response.data.message
        });
      });
    };
    
  }
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

export const fillCart = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId,
      },
    })
      .then((res) => {
        dispatch({
          type: "FILL_CART",
          payload: res.data.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const resetErrmsg = (isi = "") => {
  return {
    type: "RESET_ERRMSG",
    payload: isi
  }
}

export const verifEmail = (userData) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/users/req-verif`, {userData})
    dispatch({
      type: "RESET_ERRMSG",
      payload: "link Verifikasi terkirim"
    })
  }
}

export const forgetPassword = (userData) => {
  // 1. cek email
  // 2. kalo ada kirim email
  // 3. set errmsg pesan sudah dikirim
  if (userData == "") {
    return {
      type: "RESET_ERRMSG",
      payload: "Email tidak boleh kosong"
    }
  } else {
    return (dispatch) => {
      Axios.post(`${API_URL}/users/forget`, userData)
      .then((res) => {
        console.log(res)
        dispatch({
          type: "RESET_ERRMSG",
          payload: res.data
        })
      })
      .catch((err) => {
        if (err.response.data.message == "No value present") {
          dispatch({
            type: "RESET_ERRMSG",
            payload: "email belum terdaftar!"
          })
        } else {
          console.log(err)
        }
      })
    }
  }
}

export const resetPassword = (userData) => {
  // 1. cek email
  // 2. kalo ada kirim email
  // 3. set errmsg pesan sudah dikirim
  if (userData == "") {
    return {
      type: "RESET_ERRMSG",
      payload: "Email tidak boleh kosong"
    }
  } else {
    return (dispatch) => {
      Axios.put(`${API_URL}/users/reset`, userData)
      .then((res) => {
        console.log(res)
        dispatch({
          type: "RESET_ERRMSG",
          payload: res.data
        })
      })
      .catch((err) => {
        console.log(err.response.data.message)
        dispatch({
          type: "RESET_ERRMSG",
          payload: err.response.data.message
        })
      })
    }
  }
}

export const editPassword = (userData) => {
  // 1. login dulu terus get data2 usernya
  // 2. kalo login gagal, berarti passwordnya salah, request password baru
  // 3. jika berhasil, data2 yang di get di push balik ke server dengan password diganti
  return (dispatch) => {
  const { username, password, newPassword } = userData;
      Axios.get(`${API_URL}/users`, {
        params: {
          username,
          password,
        },
      })
        .then((res) => {
          Axios.put(`${API_URL}/users/edit/password/${res.data.id}`, 
          {...res.data,
            password: newPassword})
            .then((res) => {
              console.log("BERHASIL BJIUNGAN")
              swal("Berhasil!", "Kata sandi "+ res.data.username+ " berhasil diubah", "success")
            })
            .catch((err) => {
            })
        })
        .catch((err) => {
          swal("Gagal", "Gagal mengubah kata sandi " + err.response.data.message, "error")
        });
    };
}

export const editDataUser = (userData) => {
  return (dispatch) => {
    const { id, userrealname, userphone } = userData;
  
    Axios.get(`${API_URL}/users/${id}`)
      .then((res) => {
        Axios.put(`${API_URL}/users/edit/${res.data.id}`, 
        {...res.data,
          userrealname,
          userphone,
        })
          .then((res) => {
            console.log("BERHASIL BJIUNGAN")
            swal("Berhasil!", "Data "+ res.data.username+ " berhasil diubah", "success")
            dispatch({
              type: ON_LOGIN_SUCCESS,
              payload: res.data, 
            })
          })
          .catch((err) => {
          })
      })
      .catch((err) => {
        swal("Gagal", "Gagal mengubah data " + err.response.data.message, "error")
      });
  }
};