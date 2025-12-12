import MailIcon from "../assets/icons/mail-icon.png";
import PasswordIcon from "../assets/icons/password-icon.png";

export function SignUp() {
  return (
    <div className="auth-form-content">
      <div className="form-caption">
        <h1>Create an account</h1>
        <h3>Enter your email and password to sign up for this app</h3>
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
        <button>Sign Up</button>
      </form>
      <small className="">
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
        <span className="helper-link"> Sign in</span>
      </p>
    </div>
  );
}
