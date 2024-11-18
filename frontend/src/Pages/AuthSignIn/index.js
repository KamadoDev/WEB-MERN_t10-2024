import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import SnowFlakes from "../../Event/SnowFlakes";

const AuthSignIn = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  return (
    <>
      <section className="section signInPage">
        <SnowFlakes />
        <div className="container">
          <div className="boxSignIn card p-3 border-0">
            <div className="signinLogo text-center">
              {/* <img src="logo" width="100" alt="Logo" /> */}
              Logo
            </div>
            <form className="mt-3">
              <h2 className="mb-4 text-capitalize">Sign In</h2>
              <div className="form-group">
                <TextField
                  // error
                  className="w-100"
                  id="standard-basic"
                  label="Email"
                  type="email"
                  variant="standard"
                  required
                />
              </div>
              <div className="form-group">
                <TextField
                  // error
                  className="w-100"
                  id="standard-basic"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  required
                />
              </div>
              <Link className="border-effect text-capitalize cursor txt">
                Forgot Password?
              </Link>
              <div className="d-flex align-items-center mt-3 mb-3 ">
                <Button
                  type="submit"
                  className="btn-blue mr-2 col btn-lg btn-big"
                >
                  Sign In
                </Button>
                <Link to="/">
                  <Button
                    onClick={() => context.setisHeaderFooterShow(true)}
                    className="btn-lg btn-big btn-cancel"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
              <p className="txt text-capitalize">
                Not Registered?{" "}
                <Link className="border-effect" to="/signUp">
                  Sign up
                </Link>
              </p>
              <h6 className="mt-4 text-center font-weight-bold">
                Or continue with social account
              </h6>
              <Button className="mt-2 loginWithGoogle btn-cancel text-capitalize">
                <FcGoogle />
                Sign In with google
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthSignIn;
