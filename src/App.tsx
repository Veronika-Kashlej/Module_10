import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Home } from "./pages/Home";
import { Route, Routes } from "react-router";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { authService } from "./api/authService";
import { AuthContext } from "./store/contexts/AuthContext";
import { Profile } from "./pages/Profile/Profile";
import { ThemeContext } from "./store/contexts/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <ThemeContext value={{ theme, setTheme }}>
        <AuthContext value={{ isAuthenticated, setIsAuthenticated }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route
              path="/sign-up"
              element={isAuthenticated ? <Home /> : <SignUp />}
            ></Route>
            <Route
              path="/sign-in"
              element={isAuthenticated ? <Home /> : <SignIn />}
            ></Route>
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Home />}
            ></Route>
          </Routes>
          <Footer />
        </AuthContext>
      </ThemeContext>
    </>
  );
}

export default App;
