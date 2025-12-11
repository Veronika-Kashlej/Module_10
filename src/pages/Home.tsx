import { CreatePost } from "../components/CreatePost/CreatePost";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";

export function Home() {
  return (
    <>
      <Header></Header>
      <main>
        <CreatePost></CreatePost>
      </main>
      <Footer></Footer>
    </>
  );
}
