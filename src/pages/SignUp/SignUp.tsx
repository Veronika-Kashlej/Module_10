import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import './SignUp.css';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import { Forms } from '../../forms/Forms';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../utils/hooks/useAuth';

function SignUp() {
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
            <main className="auth-form-content sign-up">
                <div className="form-caption">
                    <h4>{t('pages.signUp.title')}</h4>
                    <h5>{t('pages.signUp.subtitle')}</h5>
                </div>
                <Forms.SignUpForm />
                <small>
                    {t('pages.signUp.legal.prefix')}
                    <a rel="noreffer" href="https://www.google.com/">
                        {' '}
                        {t('pages.signUp.legal.terms')}{' '}
                    </a>
                    {t('pages.signUp.legal.conjunction')}
                    <a rel="noreffer" href="https://www.google.com/">
                        {' '}
                        {t('pages.signUp.legal.privacy')}
                    </a>
                </small>
                <p>
                    {t('pages.signUp.smallText')}
                    <Link to={'/sign-in'} className="helper-link">
                        {' '}
                        {t('pages.signUp.linkToSignIn')}
                    </Link>
                </p>
            </main>
        </>
    );
}

export default SignUp;
