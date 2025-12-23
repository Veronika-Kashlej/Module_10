import { useState } from "react";
import "./Header.css";
import { useAuth } from "../../store/contexts/AuthContext";
import { Link, useLocation } from "react-router";
import { Icons } from "../Icons/Icons";

export function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
    document.body.removeEventListener("click", closeMenu);
  };

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(true);
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.body.addEventListener("click", closeMenu);
  };

  return (
    <>
      {isMenuOpen && <div className="menu-overlay" />}
      <header className={`header ${isMenuOpen ? "open" : ""}`}>
        <div className="header-content">
          <Link to={"/"}>
            <Icons.SidekickLogo />
          </Link>
          {!isAuthPage && (
            <>
              <div
                className={`burger ${isMenuOpen ? "open" : ""}`}
                onClick={openMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              {!isAuthenticated && (
                <nav className="desktop-menu">
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
              {isAuthenticated && (
                <Link className="profile-info" to={"/profile"}>
                  <div className="profile-image"></div>
                  <p className="user-name">Name Surname</p>
                </Link>
              )}
            </>
          )}
        </div>
      </header>
      <nav className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <ul>
            <li>
              <Link to={"/profile"}>Profile info</Link>
            </li>
            <li>
              <Link to={"/profile"}>Statistics</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to={"/sign-up"}>Sign Up</Link>
            </li>
            <li>
              <Link to={"/sign-in"}>Sign In</Link>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
}
