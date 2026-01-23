'use client';
import { useEffect } from 'react';
import { useAuth } from '../../store/contexts/AuthContext';
import './SignUp.css';
import { Forms } from '../../forms/Forms';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignUp() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

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
                    <Link href={'/sign-in'} className="helper-link">
                        {' '}
                        Sign in
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignUp;
