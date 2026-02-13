import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import './SignIn.css';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import { Forms } from '../../forms/Forms';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../utils/hooks/useAuth';

function SignIn() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();

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
                    <h4>{t('pages.signIn.title')}</h4>
                    <h5>{t('pages.signIn.subtitle')}</h5>
                </div>
                <Forms.SignInForm />
                <p>
                    {t('pages.signIn.smallText')}
                    <Link className="helper-link" to={'/sign-up'}>
                        {' '}
                        {t('pages.signIn.linkToSignUp')}
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignIn;
