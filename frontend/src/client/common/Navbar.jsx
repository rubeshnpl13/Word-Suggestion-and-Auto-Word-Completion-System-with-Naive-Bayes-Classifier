import { Link, NavLink, useNavigate } from "react-router-dom";

import UserContext from "store/context/UserContext";
import { useContext } from "react";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand ms-3" to="/">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <h3>Word Suggestions</h3>
          </NavLink>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"></li>
          </ul>
        </div>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item me-3">
            {user?.role === "user" ? (
              <div>
                <Link className="btn btn-primary mx-2" to="/search">
                  {user?.name}
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link className="btn btn-primary mx-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-success mx-2" to="/register">
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
