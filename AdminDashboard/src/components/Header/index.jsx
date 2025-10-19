import { Button } from "@mui/material";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import UserImage from "../UserImage";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useContext, useState } from "react";
import SearchBox from "../SearchBox";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✨ BƯỚC 1: GỌI API ĐỂ SERVER XÓA HTTP-ONLY COOKIE ("token")
      // Đường dẫn API cần khớp với router server của bạn.
      const response = await postData("/api/user/signout", {});

      // Kiểm tra kết quả từ Server
      if (response && response.success) {

        // BƯỚC 2: Xóa thông tin người dùng khỏi storage 
        // (Chỉ xóa 'user', không cần xóa 'token' vì nó không còn ở đây)
        localStorage.clear();
        sessionStorage.clear();

        // BƯỚC 3: Cập nhật trạng thái Context và hiển thị thông báo
        context.setIsLogin(false);
        context.setUserData({});
        context.setMessage(response.message || "Đăng xuất thành công");
        context.setTypeMessage("success");
        context.setOpen(true);

        // BƯỚC 4: Chuyển hướng
        setTimeout(() => {
          navigate("/authen/login");
        }, 1000);
      } else {
        // Xử lý trường hợp Server trả về lỗi
        context.setMessage(response?.message || "Lỗi đăng xuất từ Server.");
        context.setTypeMessage("error");
        context.setOpen(true);
      }
    } catch (error) {
      // Xử lý lỗi kết nối mạng hoặc lỗi khác
      console.error("Lỗi gọi API đăng xuất:", error);
      context.setMessage("Đã xảy ra lỗi hệ thống khi đăng xuất.");
      context.setTypeMessage("error");
      context.setOpen(true);
    }
  };

  return (
    <>
      <header className="fixed shadow-sm top-0 right-0 bg-white py-3 z-[100] flex items-center justify-between px-4">
        <SearchBox />
        <div className="ml-auto part2">
          <ul className="flex items-center gap-3">
            <li>
              <Button>
                <IoNotificationsOutline />
              </Button>
            </li>
            <li>
              <Button>
                <IoMailOutline />
              </Button>
            </li>
            <li>
              <div className="d-flex myAcc" onClick={handleClick}>
                <UserImage avatar={context.userData?.avatar} />
                <div>
                  <h5 className="text-sm mb-1">{context.userData?.username}</h5>
                  <p>{context.userData?.phone}</p>
                </div>
              </div>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};
export default Header;
