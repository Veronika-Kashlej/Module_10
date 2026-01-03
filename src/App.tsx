import "./App.css";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { Route, Routes } from "react-router";
import { SignUp } from "./pages/SignUp/SignUp";
import { SignIn } from "./pages/SignIn/SignIn";
import { AuthProvider } from "./store/contexts/AuthContext";
import { Profile } from "./pages/Profile/Profile";
import { ThemeProvider } from "./store/contexts/ThemeContext";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { NotFound } from "./pages/NotFound/NotFound";
import { ErrorBoundaryFallback } from "./components/ErrorBoundaryFallback/ErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/sign-up" element={<SignUp />}></Route>
              <Route path="/sign-in" element={<SignIn />}></Route>
              <Route path="/error" element={<ErrorBoundaryFallback />}></Route>
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              ></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </ErrorBoundary>
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
