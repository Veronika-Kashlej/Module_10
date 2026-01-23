import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../store/contexts/AuthContext';
import './SignIn.css';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import { Forms } from '../../forms/Forms';

function SignIn() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <SimpleHeader />
            <main className="auth-form-content sign-in">
                <div className="form-caption">
                    <h4>Sign in into an account</h4>
                    <h5>
                        Enter your email and password to sign in into this app
                    </h5>
                </div>
                <Forms.SignInForm />
                <p>
                    Forgot to create an account?
                    <Link className="helper-link" to={'/sign-up'}>
                        {' '}
                        Sign up
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignIn;
