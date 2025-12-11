import logo from "../../assets/logo/logo.png";
import "./Header.css";
export function Header() {
  return (
    <header>
      <img src={logo} alt="sidekick logo" />
      <div className="profile-info">
        <div className="profile-image"></div>
        <p>Name Surname</p>
      </div>
    </header>
  );
}
