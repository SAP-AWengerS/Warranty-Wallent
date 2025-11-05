import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../../Config/Axios/Axios";
import { UserContext } from "../../../App";
import { MailFilled, PhoneFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
// import LoginLoaderOverlay from "../../../Components/LoginLoaderOverlay/LoginLoaderOverlay";

const Login = ({ setauthenticated }) => {
  const [err, seterr] = useState("");
  const [loader, setLoader] = useState(true);

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await Axios.post(
            "/api/v1/app/auth/whoami",
            {},
            {
              headers: {
                authorization: `bearer ${token}`,
              },
            }
          );
          setUser(response.data.user);
        }
      } catch (err) {
        console.log(err);
        seterr("Session Expired! login again...");
        localStorage.removeItem("token");
      } finally {
        setLoader(false);
      }
    };

    checkSession();
  }, [setUser, nav]);

  const login = async (credentialResponse) => {
    setLoader(true);
    try {
      const token = credentialResponse.credential;
      const response = await Axios.post("/api/v1/app/auth/signUpWithGoogle", {},{
        headers: {
          authorization: `bearer ${token}`,
        },
      });
      const { user, token: newToken } = response.data;
      setUser(user);
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Login Failed:", error);
      seterr("Login Failed. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      login();
    }
  };

  return (
    <>
      <section className="bg-primary py-3 py-md-5 py-xl-8" style={{ height: "100vh", width: "100vw" }}>
        <div className="container mt-5">
          <div className="row gy-4 align-items-center">
            <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center text-bg-primary">
                <div className="col-12 col-xl-9">
                  <h1><b>Warranty Wallet</b></h1>
                  <hr className="border-primary-subtle mb-4" />
                  <p className="lead mb-5">
                    <strong> Effortlessly organize and track all your warranties in one place with Warranty Wallet. Never lose sight of what’s covered – keep your warranties safe, secure, and always within reach!</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-5">
              <div className="card border-0 rounded-4">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4">
                        <h3>Sign in</h3>
                      </div>
                    </div>
                  </div>
                  <div className="w-100 d-flex">
                    <div className="flex-grow-1">
                      <GoogleLogin
                        width={320}
                        onSuccess={(credentialResponse) => {
                          login(credentialResponse);
                        }}
                        onError={() => {
                          console.log("Login Failed");
                          setLoader(false);
                        }}
                      />
                    </div>
                  </div>
                  <hr className="border-primary-subtle mb-4" />
                  <div className="row">
                    <div className="col-12">
                      <p className="mt-4 mb-4">Contact us</p>
                      <div className="d-flex gap-2 gap-sm-3 justify-content-centerX">
                        <a
                          href="mailto:dev.codhub@gmail.com"
                          className="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <MailFilled />
                        </a>
                        <a
                          href="#!"
                          className="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <PhoneFilled />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <LoginLoaderOverlay isVisible={loader} /> */}
    </>
  );
};

export default Login;
