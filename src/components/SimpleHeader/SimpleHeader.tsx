import { Link } from "react-router";
import { Icons } from "../Icons/Icons";

export function SimpleHeader() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to={"/"}>
          <Icons.SidekickLogo />
        </Link>
      </div>
    </header>
  );
}
