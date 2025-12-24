import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Notification } from "../../components/Notification/Notification";
import { useAuth } from "../../store/contexts/AuthContext";
import "./SignUp.css";
import { Icons } from "../../components/Icons/Icons";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, signUp } = useAuth();

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className="auth-form-content sign-up">
      <div className="form-caption">
        <h4>Create an account</h4>
        <h5>Enter your email and password to sign up for this app</h5>
      </div>
      <form>
        <fieldset>
          <label htmlFor="email">
            <Icons.EmailIcon />
            <span>Email</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">
            <Icons.PasswordIcon />
            <span>Password</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            required
          />
        </fieldset>
        <button onClick={handleSubmit}>Sign Up</button>
      </form>
      <small>
        By clicking continue, you agree to our
        <a rel="noreffer" href="https://www.google.com/">
          {" "}
          Terms of Service{" "}
        </a>
        and
        <a rel="noreffer" href="https://www.google.com/">
          {" "}
          Privacy Policy
        </a>
      </small>
      <p>
        Already have an account?
        <Link to={"/sign-in"} className="helper-link">
          {" "}
          Sign in
        </Link>
      </p>
      {error && <Notification message={error} />}
    </main>
  );
}
