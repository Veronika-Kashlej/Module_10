import { useContext } from "react";
import logo from "../../assets/logo/logo.png";
import "./Header.css";
import { Link } from "react-router";
import { AuthContext } from "../../store/contexts/AuthContext";

export function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <header>
      <Link to={"/"}>
        <img src={logo} alt="sidekick logo" />
      </Link>
      {isAuthenticated ? (
        <Link className="profile-info" to={"/profile"}>
          <div className="profile-image"></div>
          <p>Name Surname</p>
        </Link>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to={"/sign-up"}>Sign Up</Link>
            </li>
            <li>
              <Link to={"/sign-in"}>Sign In</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
