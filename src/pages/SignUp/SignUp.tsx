import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../store/contexts/AuthContext';
import './SignUp.css';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import { Forms } from '../../forms/Forms';

function SignUp() {
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
            <main className="auth-form-content sign-up">
                <div className="form-caption">
                    <h4>Create an account</h4>
                    <h5>
                        Enter your email and password to sign up for this app
                    </h5>
                </div>
                <Forms.SignUpForm />
                <small>
                    By clicking continue, you agree to our
                    <a rel="noreffer" href="https://www.google.com/">
                        {' '}
                        Terms of Service{' '}
                    </a>
                    and
                    <a rel="noreffer" href="https://www.google.com/">
                        {' '}
                        Privacy Policy
                    </a>
                </small>
                <p>
                    Already have an account?
                    <Link to={'/sign-in'} className="helper-link">
                        {' '}
                        Sign in
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignUp;
