import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { fillCart, navbarInputHandler } from "../../../redux/actions";

import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

import "./base.css";
import ProductCard from "../../components/Cards/ProductCard";
import { connect } from "react-redux";

class BaseC extends React.Component {

  state = {
    activeIndex: 0,
    animating: false,
    ItemforSaleData: [],
    categoryList: [],
    paketList: [],
    categoryFilter: "",
  }

  componentDidMount() {
    this.getItemforSaleData();
    this.getCategory();
    this.getPaket();
  }

  renderCarouselItems = () => {
    return this.state.ItemforSaleData.map(({ productimage, productname, productdesc, id }) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={id.toString()}
        >
          <div className="carousel-item-home">
            <div className="container position-relative">
              <div onClick={(e) => alert("lel")} className="row" style={{ paddingTop: "80px" }}>
                <div className="col-1"></div>
                <div className="col-5 text-white ">
                  <div>
                  <h2>{productname}</h2>
                  <p className="mt-4">{productdesc}</p>
                  </div>
                </div>
                <div className="col-6">
                  <img src={productimage} alt="" style={{ height: "250px"}} />
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      );
    });
  };

  nextHandler = () => {
    if (this.state.animating) return;
    let nextIndex =
      this.state.activeIndex === this.state.ItemforSaleData.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  prevHandler = () => {
    if (this.state.animating) return;
    let prevIndex =
      this.state.activeIndex === 0
        ? this.state.ItemforSaleData.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: prevIndex });
  };

  getItemforSaleData = () => {
    Axios.get(`${API_URL}/products/all`)
      .then((res) => {
        this.setState({ ItemforSaleData: res.data });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  getCategory = () => {
    Axios.get(`${API_URL}/category`)
    .then((res) => {
      this.setState({ categoryList: res.data });
    })
    .catch((err) => {
      console.log(err.response.data.message);
    });
}

getPaket = () => {
  Axios.get(`${API_URL}/Paket`)
  .then((res) => {
    this.setState({ paketList: res.data });
  })
  .catch((err) => {
    console.log(err.response.data.message);
  });
}
 


  addToCartHandler = (produkId) => {
    if (!this.props.user.id) {
      swal("Masuk!", "Anda belum masuk", "warning")
    }
    Axios.get(`${API_URL}/carts/get/${this.props.user.id}/${produkId}`)
    .then((res) => {
      // console.log(res.data[0].cartId)
      Axios.put(`${API_URL}/carts/${res.data[0].cartId}/qty/${+1}`)
      .then((res) =>{swal("Berhasil!", "Produk "+ res.data.product.productname+ " berhasil ditambah kekeranjang", "success")})
      .catch((err) =>{console.log(err)
        console.log("error add old")
      })
    })
    .catch((err) => {
      Axios.post(`${API_URL}/carts/addnew/${this.props.user.id}/${produkId}`, {quantity: 1})
      .then((res) => {
        console.log(res.data)
        swal("Berhasil!", "Produk "+ res.data.product.productname+ " berhasil ditambah kekeranjang", "success")
       })
      .catch((err) => {
        console.log("error add new")
      })
    })
  }

  renderProducts = () => {
    if (this.state.categoryFilter != "paket")
    return this.state.ItemforSaleData.map((val) => {
      if (
        val.productname.toLowerCase().includes(this.props.search.searchValue.toLowerCase())
        // && val.category.toLowerCase().includes(this.state.categoryFilter.toLowerCase())
      )
      {
        return (
          <>
            <ProductCard
              key={`itemForSale-${val.id}`}
              data={val}
              className="m-3"
              onClick={(e) => this.addToCartHandler(val.id)}
            />
          </>
        );
      }    
    });
  };

  // renderPaymentData = () => {
  //   return this.state.paketList.map((val, idx) => {
  //     const { transactionId, totalprice, status, buydate, paydate, 
  //       shippingaddress, transactionbill, transactiontext, transactioninvoice, user} = val;
  //     // const { id } = user  
  //     return (
  //       <tr>
  //         <td>
  //           <strong>{idx + 1}</strong>
  //         </td>
  //         <td>
  //           {/* <strong>{id}</strong> */}
  //         </td>
  //         <td>
  //           <div className="container">
  //               <div>
  //                 <strong>{status}</strong>
  //               </div>
  //           </div>
  //         </td>
  //         <td style={{ verticalAlign: "middle" }}>
  //           <strong>{totalprice}</strong>
  //         </td>
  //         <td>
  //           {/* <strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis aut rerum dolor rem totam. Accusantium, omnis! Obcaecati iure nisi alias exercitationem! Cum iusto ab a suscipit soluta magni? Vitae, animi.</strong> */}
  //           <strong>{transactiontext}</strong>
  //         </td>
  //         <td>
  //           {status == "sudah" ? (
  //             null
  //           ) : (
  //             <ButtonUI
  //             disabled
  //             type="outlined"
  //             onClick={(e) => this.toggleModal(transactionId, transactionbill)}
  //             >
  //               Cek
  //             </ButtonUI>
  //           )}
  //         </td>
  //       </tr>
  //     );
  //   });
  // };

  // renderHeadProductList = () => {
  //   return(
  //     <>
  //       <table className="dashboardCart-table">
  //         <thead>
  //           <tr>
  //             <th>No</th>
  //             <th>userId</th>
  //             <th>Status</th>
  //             <th>Total</th>
  //             <th>Pesan</th>
  //             <th></th>
  //           </tr>
  //         </thead>
  //         <tbody>{this.renderPaymentData()}</tbody>
  //       </table>
  //     </>
  //   )
  // }

  // rendercard = () => {
  //   if (this.state.categoryFilter == "paket")
  //   return this.state.paketList.map((val) => {
  //     if (
  //       val.productname.toLowerCase().includes(this.props.search.searchValue.toLowerCase())
  //       // && val.category.toLowerCase().includes(this.state.categoryFilter.toLowerCase())
  //     )
  //     {
  //       return (
  //         <>
  //           <div className="container py-1">
  //         <div className="row">
  //           <div className="col py-2">
  //             <div className="dashboardCart">
  //               <div className="customhdbg">
  //               <caption style={{color: "black"}}>
  //                 <h2 className="py-2 pl-2">Paket</h2>
  //               </caption>
  //               </div>
  //               {this.renderHeadProductList()}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //         </>
  //       );
  //     }    
  //   });
  // }
  
  renderNavCardMenu = () => {
    return this.state.categoryList.map((val, idx) => {
      const { id, categoryname } = val;
      return(
        <li onClick={() => this.setState({ categoryFilter: categoryname })}className="list-group-item ">
          <ButtonUI type="textual">{categoryname}</ButtonUI>
        </li>
      )
    }

    )
  }

  renderNavCard = () => {
    return (
      <div className="card sticky-top cardNav">
        <div className="card-header cardNav-header">
          <ButtonUI 
          type="textual"onClick={() => this.setState({ categoryFilter: "" })}
          style={{ color: "inherit", textDecoration: "inherit"}}  
          ><h5 className="card-title">Menu</h5>
          </ButtonUI>
           </div>
            {/* <Link to="/" style={{ color: "inherit", textDecoration: "inherit"}} > */}
            <ul className="list-group listNav-group-flush">
              {this.renderNavCardMenu()}
              <li onClick={() => this.setState({ categoryFilter: "paket" })}className="list-group-item ">
                <ButtonUI type="textual">Paket</ButtonUI>
              </li>
            </ul>
            {/* </Link> */}
          </div>
        )
  }

  render(){
    return(
    <div className="container">
      <div className="row">
        {/* <div className="col-1"></div> */}
        <div className="col-2 py-2 px-1 container">
          {this.renderNavCard()}
        </div>
        <div className="col py-2 px-1" style={{width: "auto"}}>
          {/* <div className="col offset-3 mt-2" style={{width: "auto"}}> */}
          <Carousel
            className="carousel-item-home-bg "
            next={this.nextHandler}
            previous={this.prevHandler}
            activeIndex={this.state.activeIndex}
            >
            {this.renderCarouselItems()}
            <CarouselControl
              directionText="Previous"
              direction="prev"
              onClickHandler={this.prevHandler}
            />
            <CarouselControl
              directionText="Next"
              direction="next"
              onClickHandler={this.nextHandler}
            />
          </Carousel>
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderProducts()}
          </div>
          </div>
      </div>
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
  onFillCart: fillCart,
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseC);
