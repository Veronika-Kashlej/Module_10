import "./App.css";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Home } from "./pages/Home/Home";
import { Route, Routes } from "react-router";
import { SignUp } from "./pages/SignUp/SignUp";
import { SignIn } from "./pages/SignIn/SignIn";
import { AuthProvider } from "./store/contexts/AuthContext";
import { Profile } from "./pages/Profile/Profile";
import { ThemeProvider } from "./store/contexts/ThemeContext";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            <Route path="/sign-in" element={<SignIn />}></Route>
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            ></Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
