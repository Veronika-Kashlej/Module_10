import { useContext } from "react";
import "./Header.css";
import { AuthContext } from "../../store/contexts/AuthContext";
import { SidekickLogo } from "../../assets/logo/sidekick-logo";
import { Link, useLocation } from "react-router";

export function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

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
        !isAuthPage && (
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
        )
      )}
    </header>
  );
}
