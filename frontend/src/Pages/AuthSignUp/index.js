import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import SnowFlakes from "../../Event/SnowFlakes";

const AuthSignUp = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  return (
    <>
      <section className="section signInPage signUpPage">
        <SnowFlakes />
        <div className="container">
          <div className="boxSignIn boxSignUp card p-3 border-0">
            <div className="signinLogo text-center">
              {/* <img src="logo" width="100" alt="Logo" /> */}
              Logo
            </div>
            <form className="mt-3">
              <h2 className="mb-4 text-capitalize">Sign Up</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // error
                      className="w-100"
                      id="standard-basic"
                      label="Name"
                      type="text"
                      variant="standard"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // error
                      className="w-100"
                      id="standard-basic"
                      label="Phone No"
                      type="text"
                      variant="standard"
                      required
                    />
                  </div>
                </div>
              </div>
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
                  Sign Up
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
                already have an account?{" "}
                <Link className="border-effect" to="/signIn">
                  Sign In
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

export default AuthSignUp;
