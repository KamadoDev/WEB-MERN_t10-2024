import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
const HomeBanner = () => {
  return (
    <>
      <div className="container">
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
                  src="https://res.cloudinary.com/da26rdzwp/image/upload/v1725960685/1725960683838_1722687677537_1721277206951_banner4.jpg"
                  alt=""
                  className="w-100"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="item">
                <img
                  src="https://res.cloudinary.com/da26rdzwp/image/upload/v1726326641/1726326640915_New_Project_27.jpg"
                  alt=""
                  className="w-100"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="item">
                <img
                  src="https://res.cloudinary.com/da26rdzwp/image/upload/v1726984350/1726984350028_New_Project_14.jpg"
                  alt=""
                  className="w-100"
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
