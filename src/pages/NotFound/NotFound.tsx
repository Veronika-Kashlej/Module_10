import { Icons } from "../../components/Icons/Icons";
import "./NotFound.css";

export function NotFound() {
  return (
    <main className="not-found-page">
      <Icons.NotFoundIcon />
      <h1>Page not found</h1>
    </main>
  );
}
