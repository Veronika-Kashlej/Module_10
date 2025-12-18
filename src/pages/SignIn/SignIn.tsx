import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Notification } from "../../components/Notification/Notification";
import { authService } from "../../api/authService";
import { AuthContext } from "../../store/contexts/AuthContext";
import { PasswordIcon } from "../../assets/icons/password-icon";
import { EmailIcon } from "../../assets/icons/email-icon";
import "./SignIn.css";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password, error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authService.signIn(email, password);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <>
      <div className="auth-form-content sign-in">
        <div className="form-caption">
          <h4>Sign in into an account</h4>
          <h5>Enter your email and password to sign in into this app</h5>
        </div>
        <form>
          <fieldset>
            <label htmlFor="email">
              <EmailIcon />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
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
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </fieldset>
        </form>
        <button onClick={(e) => handleSubmit(e)}>Sign In</button>
        <p>
          Forgot to create an account?
          <Link className="helper-link" to={"/sign-up"}>
            {" "}
            Sign up
          </Link>
        </p>
      </div>
      {error && <Notification message={error} />}
    </>
  );
}
