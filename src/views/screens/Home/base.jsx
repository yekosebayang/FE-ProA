import React from "react";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

import iPhoneX from "../../../assets/images/Showcase/iPhone-X.png";
import iPhone8 from "../../../assets/images/Showcase/iPhone-8.png";
import iPadPro from "../../../assets/images/Showcase/iPad-Pro.png";
import ButtonUI from "../../components/Button/Button";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import ProductCard from "../../components/Cards/ProductCard";

import "./base.css";

const dummy = [
  {
    productName: "iPhone X",
    image: iPhoneX,
    desc: `Visi Apple sejak awal adalah menciptakan iPhone yang
    sepenuhnya berisi layar. Yang begitu menghanyutkan sehingga
    tak ada lagi batasan antara perangkat dan pengalaman. Dan
    begitu cerdas sehingga dapat merespons dengan sekali sentuh,
    atau bahkan sekali pandang. Dengan iPhone X, visi ini menjadi
    kenyataan. Selamat datang, masa depan.`,
    id: 1,
  },
  {
    productName: "iPhone 8",
    image: iPhone8,
    desc: `iPhone 8 memperkenalkan desain kaca yang sepenuhnya baru. Kamera paling populer di dunia, kini lebih baik lagi. Chip yang paling andal dan cerdas di ponsel pintar. Pengisian daya nirkabel yang begitu mudah dilakukan. Dan pengalaman augmented reality yang tak pernah mungkin sebelumnya. iPhone 8. iPhone generasi baru.`,
    id: 2,
  },
  {
    productName: "iPad Pro Gen 3",
    image: iPadPro,
    desc: `
    iPad Pro baru telah didesain ulang seutuhnya dan dilengkapi dengan teknologi Apple yang paling canggih. Ini akan membuat Anda berpikir ulang apa yang iPad mampu lakukan`,
    id: 3,
  },
];

class BaseC extends React.Component {

  state = {
    activeIndex: 0,
    animating: false,
    ItemforSaleData: [],
  }

  componentDidMount() {
    this.getItemforSaleData();
  }

  renderCarouselItems = () => {
    return dummy.map(({ image, productName, desc, id }) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={id.toString()}
        >
          <div className="carousel-item-home">
            <div className="container position-relative">
              <div className="row" style={{ paddingTop: "80px" }}>
                <div className="col-4 text-white position-relative">
                  <h2>{productName}</h2>
                  <p className="mt-4">desc</p>
                  <ButtonUI
                    type="outlined"
                    style={{
                      backgroundColor: "#CCEAD7",
                      borderColor: "#CCEAD7",
                      borderRadius: "16px",
                      fontWeight: "bolder",
                      position: "absolute",
                      bottom: 210,
                    }}
                  >
                    BUY NOW
                  </ButtonUI>
                </div>
                <div className="col-3 d-flex flex-row justify-content-center">
                  <img src={image} alt="" style={{ height: "375px" }} />
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
      this.state.activeIndex === dummy.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  prevHandler = () => {
    if (this.state.animating) return;
    let prevIndex =
      this.state.activeIndex === 0
        ? dummy.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: prevIndex });
  };

  getItemforSaleData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ ItemforSaleData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProducts = () => {
    return this.state.ItemforSaleData.map((val) => {
      // if (
      //   val.productName
      //     .toLowerCase()
      //     .includes(this.props.search.searchValue.toLowerCase()) &&
      //   val.category.toLowerCase().includes(this.state.categoryFilter)
      // ) 
      // {
        return (
          // <Link
          //   style={{ textDecoration: "none", color: "inherit" }}
          //   to={`/product/${val.id}`}
          // >
            <ProductCard
              key={`bestseller-${val.id}`}
              data={val}
              className="m-3"
            />
          // </Link>
        );
      // }
    });
  };

  render(){
    return(
      <>
<div className="container-fluid">
    <div className="row">
      <div className="col-1 p bg-light"><p>text</p></div>
      <div className="col-2 py-2 px-1 bg-primary ">
      {/* <div className="col-3 position-fixed offset-sm-1 mt-2" id="sticky-sidebar"> */}
        <div className="card sticky-top">
        <div className="card-header">
          <h5 className="card-title">Menu</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li onClick={(e) => alert('lel')} className="list-group-item">Makanan</li>
          <li className="list-group-item">Minuman</li>
          <li className="list-group-item">Tambahan</li>
          <li className="list-group-item">Kudapan</li>
        </ul>
        </div>
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
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h1>Main Area</h1>
        </div>
      <div className="col-1 bg-light"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, nesciunt, deleniti dolor, necessitatibus enim totam cumque vitae explicabo illo iure neque earum cupiditate tempore commodi repellat quos magni vero ut!</p></div>
    </div>
</div>
      </>
    )
  }
}
  

export default (BaseC);
