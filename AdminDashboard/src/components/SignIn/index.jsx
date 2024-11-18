import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/SpaceX-Logo.png";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const SignIn = () => {
  const context = useContext(MyContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setIsShowHeaderFooter(true);
    console.log("SignIn");
  }, [context]);

  return (
    <>
      <div className="AuthSection">
        <header className="header flex items-center justify-between">
          <div className="logo">
            <Link to="/" onClick={() => context.setIsShowHeaderFooter(false)}>
              <img src={Logo} alt="" />
            </Link>
          </div>
          <div className="btnAuth ml-auto flex items-center justify-end gap-3">
            {/* <Link to="/authen/login">
              <Button className="btn-round btn-sigin btn-border">
                <FiLogIn />
                <span>Sign In</span>
              </Button>
            </Link> */}
            {/* <Link to="">
              <Button className="btn-round btn-sigup btn-border btn-blue">
                <FaRegUser />
                <span>Sign Up</span>
              </Button>
            </Link> */}
          </div>
        </header>
        <div className="container container_auth">
          <h1 className="text-center  font-weight-bold text-2xl">
            Welcome Back!
            <br />
            Sign in with your credentials.
          </h1>
          <div className="flex items-center gap-3 my-4 socialBtn">
            <Button className="col">
              <FcGoogle />
              <span>Sigin with google</span>
            </Button>
            <Button className="col">
              <FaFacebook style={{ color: "#3872fa" }} />
              <span>Sigin with google</span>
            </Button>
          </div>
          <h3 className="text-center text-sm font-bold">
            Or, Sign in with your account
          </h3>
          <form action="" className="form mt-3">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name" className="text-bold mb-2">
                  <strong>Username</strong>
                </label>
                <TextField
                  id="name"
                  name="name"
                  label="Name Account"
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="Please enter name account"
                  required
                />
                <FormHelperText>Required</FormHelperText>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="password" className="text-bold mb-2">
                  <strong>Password</strong>
                </label>
                <div className="formPassword relative">
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    placeholder="Please enter password"
                    required
                  />
                  <Button onClick={handleTogglePassword}>
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </Button>
                </div>
                <FormHelperText>Required</FormHelperText>
              </div>
            </div>
            <div className="col">
              <div className="flex items-center justify-between">
                <div className="form-group">
                  <label className="checkbox">
                    <input type="checkbox" />
                    <span className="ml-2">Remember me</span>
                  </label>
                </div>
                <div className="form-group">
                  <p className="text mb-0">
                    <Link to="/authen/forgot-password">Forgot Password?</Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <Button className="btnAuthSend w-100 mb-2">
                <span className="text-gray-600">Sign In</span>
              </Button>
            </div>
            {/* <div className="col">
              <p className="text-center text">
                Don’t have an account? <a href="/signUp">Sign Up</a>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
