import { useState, useEffect } from "react";

import validator from "utils/validator";
import loginSchema from "utils/loginSchema";

import Input from "common/Input";
import Button from "common/Button";

import { login } from "api/request.api";

import UserContext from "store/context/UserContext";
import { useContext } from "react";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = validator(loginSchema);

  const handleChange = (e) => {
    const { name, value } = e.target;
    validate(name, value, { errors, setErrors });
    setData({ ...data, [name]: value });
  };

  const isValid = () => {
    for (const [key, value] of Object.entries(data))
      validate(key, value, { errors, setErrors });

    if (Object.keys(errors).length === 0) return true;
    else return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid()) {
      try {
        const res = await login(data);
        localStorage.setItem("token", res.data.accessToken);
        setUser(res.data.user);
        if (res.data.user.role == "user") {
          navigate("/search");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Form validation failed");
    }
  };
  // if (user) {
  //   navigate("/search");
  // }
  // useEffect(() => {
  //   if (user) {
  //     navigate("/search");
  //   }
  // }, [user, navigate]);

  return (
    <div>
      <div className="container-fluid">
        <div
          className="row vh-100 justify-content-center align-items-center"
          style={{ backgroundColor: "darkgray" }}
        >
          <div className="col-5">
            <div className="row">
              <div className="col-12 text-center">
                <h1>Login</h1>
              </div>

              <div className="col-12 border rounded-2 p-5 bg-white">
                <form onClick={handleSubmit}>
                  <Input
                    label="Email"
                    type="text"
                    placeholder="Enter email..."
                    name="email"
                    id="email"
                    value={data.email}
                    error={errors?.email}
                    handler={handleChange}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password..."
                    name="password"
                    id="password"
                    value={data.password}
                    error={errors?.password}
                    handler={handleChange}
                  />
                  <Button label="Login" type="submit" color="primary" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
