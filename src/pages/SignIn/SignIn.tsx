import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../store/contexts/AuthContext";
import "./SignIn.css";
import { Icons } from "../../components/Icons/Icons";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    navigate("/");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <main className="auth-form-content sign-in">
        <div className="form-caption">
          <h4>Sign in into an account</h4>
          <h5>Enter your email and password to sign in into this app</h5>
        </div>
        <form>
          <fieldset>
            <label htmlFor="email">
              <Icons.EmailIcon />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              id="email"
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
          <button onClick={handleSubmit}>Sign In</button>
        </form>
        <p>
          Forgot to create an account?
          <Link className="helper-link" to={"/sign-up"}>
            {" "}
            Sign up
          </Link>
        </p>
      </main>
    </>
  );
}
