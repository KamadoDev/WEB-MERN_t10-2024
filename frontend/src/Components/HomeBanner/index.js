import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import bannerTet from "../../assets/images/banner-tet.jpg"
import bannerTet1 from "../../assets/images/banner-tet-la-gi.jpg"
import bannerTet2 from "../../assets/images/tet2.jpg"

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
const HomeBanner = () => {
  return (
    <>
      <div className="container" style={{marginTop: "230px"}}>
        <div className="homeBannerSection mt-4">
          <Swiper
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            spaceBetween={15}
            loop={true}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="item">
                <img
                  src={bannerTet}
                  alt=""
                  className="w-100"
                  style={{height: "369px"}}
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="item">
                <img
                  src={bannerTet1}
                  alt=""
                  className="w-100"
                  style={{height: "369px"}}
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="item">
                <img
                  src={bannerTet2}
                  alt=""
                  className="w-100"
                  style={{height: "369px"}}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
