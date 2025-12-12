import "./App.css";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

function App() {
  // return <Home></Home>;
  return (
    <>
      <Header></Header>
      <SignUp></SignUp>
      <Footer></Footer>
    </>
  );
}

export default App;
