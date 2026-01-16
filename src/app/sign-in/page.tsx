'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/contexts/AuthContext';
import { SimpleHeader } from '@/components/SimpleHeader/SimpleHeader';
import { Forms } from '@/components/Forms/Forms';
import './SignIn.css';

function SignIn() {
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
                    <Link className="helper-link" href={'/sign-up'}>
                        {' '}
                        Sign up
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignIn;
