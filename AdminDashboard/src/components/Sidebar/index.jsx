import { Link } from "react-router-dom";
import Logo from "../../assets/images/SpaceX-Logo.png";
import Button from "@mui/material/Button";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiProductHuntLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
// import { FaAngleRight } from "react-icons/fa6";
// import { BsCartCheck } from "react-icons/bs";
// import { IoMdNotificationsOutline } from "react-icons/io";
// import { IoSettingsOutline } from "react-icons/io5";
// import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { useContext, useState } from "react";
import NavTab from "./NavTab";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { MyContext } from "../../App";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setToggleSubmenu] = useState(false);
  const context = useContext(MyContext);

  const handleTabClick = (index) => {
    if (activeTab === index) {
      setToggleSubmenu(!isToggleSubmenu); // Toggle submenu
    } else {
      setActiveTab(index);
      setToggleSubmenu(true); // Mở submenu mới
    }
  };

  const productsSubmenu = [
    { label: "Danh sách sản phẩm", link: "/products/list" },
    { label: "Thêm sản phẩm", link: "/products/create" },
  ];
  const categoriesSubmenu = [
    { label: "Danh sách danh mục", link: "/category/list" },
    { label: "Thêm danh mục", link: "/category/create" },
    { label: "Danh mục phụ", link: "/subcategory/list" },
    { label: "Thêm danh mục phụ", link: "/subcategory/create" },
  ];

  return (
    <>
      <div className="sidebar fixed top-0 left-0 z-[100] w-[15%]">
        <Collapse in={context.open} className="position-fixed bottom-0">
          <Alert
            variant="filled"
            severity={context.TypeMessage === "success" ? "success" : "error"}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  context.setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {context.Message}
          </Alert>
        </Collapse>
        <Link to={""}>
          <div className="logoWrapper flex items-center">
            <img className="px-4 mt-2" src={Logo} alt="logo" />
          </div>
        </Link>

        <div className="sidebarTabs px-2 mt-3">
          <ul className="flex gap-2 flex-col">
            <li>
              <Link to="/">
                <Button
                  className={`w-100 py-2 ${activeTab === 0 ? "active" : ""}`}
                  onClick={() => setActiveTab(0)}
                >
                  <LuLayoutDashboard className="mr-1" />
                  <span className="">Dashboard</span>
                </Button>
              </Link>
            </li>

            <NavTab
              index={1}
              activeTab={activeTab}
              isToggleSubmenu={isToggleSubmenu}
              setActiveTab={handleTabClick}
              submenus={productsSubmenu}
              title="Sản phẩm"
              iconNav={<RiProductHuntLine className="mr-1" />}
            />

            <NavTab
              index={2}
              activeTab={activeTab}
              isToggleSubmenu={isToggleSubmenu}
              setActiveTab={handleTabClick}
              submenus={categoriesSubmenu}
              title="Danh mục"
              iconNav={<MdOutlineCategory className="mr-1" />}
            />

            {/* <li>
              <Button
                className={`w-100 py-2 ${activeTab === 1 ? "active" : ""}`}
                onClick={() => IndexOpenSubmenu(1)}
              >
                <RiProductHuntLine className="mr-1" />
                <span className="">Products</span>
                <FaAngleRight
                  className={`${
                    activeTab === 1 && isToggleSubmenu === true
                      ? "angleIcon"
                      : ""
                  } mr-1 ml-auto size-3`}
                />
              </Button>

              <div
                className={`submenuWrapper ${
                  activeTab === 1 && isToggleSubmenu === true
                    ? "colapse"
                    : "colapsed"
                }`}
              >
                <div className="submenu">
                  <Link to="/products/list">
                    <Button className="w-100">List products</Button>
                  </Link>
                  <Link to="/products/create">
                    <Button className="w-100">Add product</Button>
                  </Link>
                  <Button className="w-100">Edit product</Button>
                </div>
              </div>
            </li> */}

            {/* <li>
              <Button
                className={`w-100 py-2 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => IndexOpenSubmenu(2)}
              >
                <BsCartCheck className="mr-1" />
                <span className="">Orders</span>
                <FaAngleRight className="mr-1 ml-auto size-3" />
              </Button>
            </li>
            <li>
              <Button
                className={`w-100 py-2 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => IndexOpenSubmenu(3)}
              >
                <FiUsers className="mr-1" />
                <span className="">Users</span>
                <FaAngleRight className="mr-1 ml-auto size-3" />
              </Button>
            </li>
            <li>
              <Button
                className={`w-100 py-2 ${activeTab === 4 ? "active" : ""}`}
                onClick={() => IndexOpenSubmenu(4)}
              >
                <IoMdNotificationsOutline className="mr-1" />
                <span className="">Notifications</span>
                <FaAngleRight className="mr-1 ml-auto size-3" />
              </Button>
            </li>

            <li>
              <h6 className="text-black/50 mb-0 capitalize ml-2 mt-3">
                authentication
              </h6>
            </li> */}
            <li>
              <Link to="/authen/login">
                <Button
                  className={`w-100 py-2 ${activeTab === 6 ? "active" : ""}`}
                  onClick={() => setActiveTab(6)}
                >
                  <FiUser className="mr-1" />
                  <span className="">Đăng nhập</span>
                  {/* <FaAngleRight className="mr-1 ml-auto size-3" /> */}
                </Button>
              </Link>
            </li>
            {/* <li>
              <Button
                className={`w-100 py-2 ${activeTab === 5 ? "active" : ""}`}
                onClick={() => setActiveTab(5)}
              >
                <IoSettingsOutline className="mr-1" />
                <span className="">Setting</span>
                <FaAngleRight className="mr-1 ml-auto size-3" />
              </Button>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
