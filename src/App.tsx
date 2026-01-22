import './App.css';
import { Footer } from './components/Footer/Footer';
import { Route, Routes } from 'react-router';
import { AuthProvider } from './store/contexts/AuthContext';
import { ThemeProvider } from './store/contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback/ErrorBoundaryFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { CustomNotificationProvider } from './store/contexts/NotificationContext';
import { lazy, Suspense } from 'react';
import { Loader } from './components/Loader/Loader';
import Home from 'pages/Home/Home';

const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
    return (
        <>
            <ThemeProvider>
                <CustomNotificationProvider>
                    <AuthProvider>
                        <ErrorBoundary
                            FallbackComponent={ErrorBoundaryFallback}
                        >
                            <Suspense
                                fallback={<Loader message="Loading page..." />}
                            >
                                <Routes>
                                    <Route path="/" element={<Home />}></Route>
                                    <Route
                                        path="/sign-up"
                                        element={<SignUp />}
                                    ></Route>
                                    <Route
                                        path="/sign-in"
                                        element={<SignIn />}
                                    ></Route>
                                    <Route
                                        path="/error"
                                        element={<ErrorBoundaryFallback />}
                                    ></Route>
                                    <Route
                                        path="/profile/:tab?"
                                        element={
                                            <PrivateRoute>
                                                <Profile />
                                            </PrivateRoute>
                                        }
                                    ></Route>
                                    <Route
                                        path="*"
                                        element={<NotFound />}
                                    ></Route>
                                </Routes>
                                <Footer />
                            </Suspense>
                        </ErrorBoundary>
                    </AuthProvider>
                </CustomNotificationProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
