import './App.css';
import { Footer } from './components/Footer/Footer';
import { Route, Routes } from 'react-router';
import { ThemeProvider } from './store/contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback/ErrorBoundaryFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { CustomNotificationProvider } from './store/contexts/NotificationContext';
import { lazy, Suspense } from 'react';
import { Loader } from './components/Loader/Loader';
import Home from 'pages/Home/Home';
import { UserProvider } from './store/contexts/UserContext';
import { ProfileInfo } from './pages/Profile/components/ProfileInfo/ProfileInfo';
import { Statistics } from './pages/Profile/components/Statistics/Statistics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: 30 * 60 * 1000,
        },
    },
});

const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
    return (
        <>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <CustomNotificationProvider>
                            <UserProvider>
                                <ErrorBoundary
                                    FallbackComponent={ErrorBoundaryFallback}
                                >
                                    <Suspense fallback={<Loader />}>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<Home />}
                                            />
                                            <Route
                                                path="/sign-up"
                                                element={<SignUp />}
                                            />
                                            <Route
                                                path="/sign-in"
                                                element={<SignIn />}
                                            />
                                            <Route element={<PrivateRoute />}>
                                                <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                >
                                                    <Route
                                                        index
                                                        path="profile"
                                                        element={
                                                            <ProfileInfo />
                                                        }
                                                    />
                                                    <Route
                                                        path="statistics"
                                                        element={<Statistics />}
                                                    />
                                                </Route>
                                            </Route>
                                            <Route
                                                path="*"
                                                element={<NotFound />}
                                            />
                                        </Routes>
                                        <Footer />
                                    </Suspense>
                                </ErrorBoundary>
                            </UserProvider>
                        </CustomNotificationProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </Provider>
        </>
    );
}

export default App;
