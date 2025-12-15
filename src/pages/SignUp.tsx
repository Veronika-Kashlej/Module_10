import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Notification } from "../components/Notification/Notification";
import { authService } from "../api/authService";
import { AuthContext } from "../store/contexts/AuthContext";
import { EmailIcon } from "../assets/icons/email-icon";
import { PasswordIcon } from "../assets/icons/password-icon";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authService.signUp(email, password);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="auth-form-content">
      <div className="form-caption">
        <h4>Create an account</h4>
        <h5>Enter your email and password to sign up for this app</h5>
      </div>
      <form>
        <fieldset>
          <label htmlFor="email">
            <EmailIcon />
            <span>Email</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">
            <PasswordIcon />
            <span>Password</span>
          </label>
          <input
            type="text"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </fieldset>
        <button onClick={(e) => handleSubmit(e)}>Sign Up</button>
      </form>
      <small>
        By clicking continue, you agree to our
        <a rel="noreffer" href="#">
          &nbsp;Terms of Service&nbsp;
        </a>
        and
        <a rel="noreffer" href="#">
          &nbsp;Privacy Policy
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
    </div>
  );
}
