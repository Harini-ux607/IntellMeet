
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Video,
  Mail,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "../index.css";

const USERS_KEY = "intellmeet_demo_users";
const CURRENT_USER_KEY = "intellmeet_current_user";

function getStoredUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : [];

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function createSalt() {
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);

  return Array.from(salt, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error("Password hashing is unavailable.");
  }

  const data = new TextEncoder().encode(`${salt}:${password}`);
  const result = await window.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(result), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(registerMode) {
    setIsRegister(registerMode);
    setMessage("");
    setPassword("");
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const users = getStoredUsers();

      if (isRegister) {
        const existingUser = users.find(
          (user) => user.email === normalizedEmail
        );

        if (existingUser) {
          setMessage(
            "An account with this email already exists. Please sign in."
          );
          setLoading(false);
          return;
        }

        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);

        const newUser = {
          name: name.trim(),
          email: normalizedEmail,
          salt,
          passwordHash,
        };

        users.push(newUser);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify({
            name: newUser.name,
            email: newUser.email,
          })
        );

        setMessage("Account created successfully! Opening dashboard...");
      } else {
        const existingUser = users.find(
          (user) => user.email === normalizedEmail
        );

        if (!existingUser) {
          setMessage(
            "Account not found. Please create an account first."
          );
          setLoading(false);
          return;
        }

        const passwordHash = await hashPassword(
          password,
          existingUser.salt
        );

        if (passwordHash !== existingUser.passwordHash) {
          setMessage("Incorrect password. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify({
            name: existingUser.name,
            email: existingUser.email,
          })
        );

        setMessage("Login successful! Opening dashboard...");
      }

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        "Unable to complete this action. Please check your browser and try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

      <header className="login-header">
        <Link to="/" className="login-brand">
          <div className="login-brand-icon">
            <Video size={23} />
          </div>
          <span>IntellMeet</span>
        </Link>

        <Link to="/" className="login-back-link">
          Back to Dashboard
        </Link>
      </header>

      <main className="login-main">
        <section className="login-welcome">
          <div className="login-welcome-badge">
            <span className="login-live-dot"></span>
            Smarter meetings start here
          </div>

          <h1>
            Work together.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Bring your meetings, conversations, and team collaboration
            together with IntellMeet.
          </p>

          <div className="login-benefits">
            <div>
              <CheckCircle2 size={19} />
              <span>Collaborate with your team</span>
            </div>
            <div>
              <CheckCircle2 size={19} />
              <span>Manage meetings in one place</span>
            </div>
            <div>
              <CheckCircle2 size={19} />
              <span>AI-powered meeting assistance</span>
            </div>
          </div>

          <div className="login-illustration">
            <div className="login-illustration-top">
              <div className="login-illustration-dot"></div>
              <div className="login-illustration-dot"></div>
              <div className="login-illustration-dot"></div>
              <span>Team collaboration</span>
            </div>

            <div className="login-illustration-content">
              <div className="login-person-card person-purple">
                <div className="login-person-avatar">J</div>
                <span>Developer</span>
              </div>

              <div className="login-illustration-center">
                <Video size={35} />
                <span>Live Meeting</span>
              </div>

              <div className="login-person-card person-blue">
                <div className="login-person-avatar">A</div>
                <span>Team member</span>
              </div>
            </div>

            <div className="login-illustration-footer">
              <span>●</span> Connected workspace
            </div>
          </div>
        </section>

        <section className="login-form-section">
          <div className="login-form-card">
            <div className="login-form-heading">
              <div className="login-form-symbol">
                {isRegister ? (
                  <UserRound size={25} />
                ) : (
                  <LockKeyhole size={25} />
                )}
              </div>

              <h2>
                {isRegister ? "Create your account" : "Welcome back"}
              </h2>

              <p>
                {isRegister
                  ? "Join your team on IntellMeet."
                  : "Sign in to continue to your workspace."}
              </p>
            </div>

            <div className="login-mode-switch">
              <button
                type="button"
                className={!isRegister ? "selected" : ""}
                onClick={() => switchMode(false)}
              >
                Sign In
              </button>

              <button
                type="button"
                className={isRegister ? "selected" : ""}
                onClick={() => switchMode(true)}
              >
                Create Account
              </button>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="login-field">
                  <label htmlFor="fullName">Full name</label>
                  <div className="login-input-wrap">
                    <UserRound size={18} />

                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="email">Email address</label>

                <div className="login-input-wrap">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>

                <div className="login-input-wrap">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div className="login-message" role="status">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create Account"
                    : "Sign In"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="login-switch-text">
              {isRegister
                ? "Already have an account?"
                : "New to IntellMeet?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(!isRegister)}
              >
                {isRegister ? "Sign in" : "Create an account"}
              </button>
            </p>

            <div className="login-security-note">
              <LockKeyhole size={14} />
              Frontend demo authentication. Use a secure backend for real accounts.
            </div>
          </div>
        </section>
      </main>

      <footer className="login-footer">
        © 2026 IntellMeet · Enterprise Meeting & Collaboration Platform
      </footer>
    </div>
  );
}

export default Login;
