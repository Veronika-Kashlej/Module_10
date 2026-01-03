import { Icons } from "../../components/Icons/Icons";
import { SimpleHeader } from "../../components/SimpleHeader/SimpleHeader";
import "./NotFound.css";

export function NotFound() {
  return (
    <>
      <SimpleHeader />
      <main className="not-found-page">
        <Icons.NotFoundIcon />
        <h1>Page not found</h1>
      </main>
    </>
  );
}
