import MailIcon from "../assets/icons/mail-icon.png";
import PasswordIcon from "../assets/icons/password-icon.png";

export function SignIn() {
  return (
    <div className="auth-form-content">
      <div className="form-caption">
        <h1>Sign in into an account</h1>
        <h3>Enter your email and password to sign in into this app</h3>
      </div>
      <form action="#">
        <fieldset>
          <label htmlFor="email">
            <img src={MailIcon} alt="mail icon" />
            <span>Email</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter email"
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">
            <img src={PasswordIcon} alt="pencil icon" />
            <span>Password</span>
          </label>
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Enter password"
            required
          />
        </fieldset>
        <button>Sign In</button>
      </form>
      <p>
        Forgot to create an account?
        <span className="helper-link"> Sign up</span>
      </p>
    </div>
  );
}
