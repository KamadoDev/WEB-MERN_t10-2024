import { Link } from "react-router-dom";
import Logo from "../../assets/images/bacola-logo.png";
import CountryDropdown from "../CountryDropDown";
import Button from "@mui/material/Button";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext } from "react";
import { MyContext } from "../../App";

const Header = () => {
  const context = useContext(MyContext);

  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg-blue">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Due to the <strong>COVID 19</strong> epidemic, orders may be
              processed with a slight delay
            </p>
          </div>
        </div>

        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link to="/">
                  <img src={Logo} alt="logo" />
                </Link>
              </div>

              <div className="col-sm-10 d-flex align-items-center part2">
                {context.countryList.lenght !== 0 && <CountryDropdown />}

                {/* Header Search Start Here */}
                <SearchBox />
                {/* Header Search Ends Here */}

                <div className="part3 d-flex align-items-center ml-auto">
                  {context.isLogin !== true ? (
                    <Link to="signIn">
                      <Button className="btn-blue btnHeaderSignin text-capitalize btn-big btn-round mr-3">
                        Sign In
                      </Button>
                    </Link>
                  ) : (
                    <Button className="circle mr-3">
                      <FiUser />
                    </Button>
                  )}
                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price">$3.29</span>
                    <div className=" position-relative ml-2">
                      <Button className="circle ">
                        <IoBagOutline />
                      </Button>
                      <span className="count d-flex align-items-center justify-content-center">
                        2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {context.subCategoryData?.lenght !== 0 && (
          <Navigation navData={context.subCategoryData} />
        )}
      </div>
    </>
  );
};

export default Header;
