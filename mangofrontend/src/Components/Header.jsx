import { Cart4 } from "react-bootstrap-icons";
import image from "../assets/mango.png";
import { Link, Form, useRouteLoaderData } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../Store/TokenContextProvider";
import { decodedToken } from "../Utils/helper";

export default function Header() {
  const {token} = useContext(TokenContext);
  let user;
  if(token){
    user = decodedToken(token);
  }
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={image} alt="investment_image" />
            Mango
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {user?.role.toLowerCase() === "admin" && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Content Management
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="coupons">
                        Coupon Management
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="products">
                        Product Management
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
              )}
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/order">
                    Manage Order
                  </Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="#"
                    >
                      {user.name}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/cart"
                    >
                      <Cart4 />
                    </Link>
                  </li>

                  <li className="nav-item">
                      <Link className="nav-link" to="/logout">Logout</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
