import { useContext } from "react";
import "./Header.css";
import { Link } from "react-router";
import { AuthContext } from "../../store/contexts/AuthContext";
import { SidekickLogo } from "../../assets/logo/sidekick-logo";

export function Header() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header>
      <Link to={"/"}>
        <SidekickLogo />
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
