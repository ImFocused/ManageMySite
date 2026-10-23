
import { useState } from "react";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { changeDemoRole } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("builder");
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { value: "builder", label: "Builder" },
    { value: "engineer", label: "Engineer" },
    { value: "contractor", label: "Contractor" },
    { value: "projectManager", label: "Project Manager" },
    { value: "viewer", label: "Viewer" },
  ];

  function handleLogin(event) {
    event.preventDefault();
    changeDemoRole(role);
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="login-brand">
          <Building2 size={30} />
          <span>ManageMySite</span>
        </div>
        <div className="login-brand-content">
          <span>CONSTRUCTION PROJECT MANAGEMENT</span>
          <h1>Every project.<br />Every milestone.<br />In one place.</h1>
          <p>
            Stay connected with your construction project,
            from progress updates to final delivery.
          </p>
        </div>
      </div>

      <div className="login-form-panel">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-heading">
            <span>WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue.</p>
          </div>

          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <div className="login-password-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label htmlFor="login-role">Demo role</label>
          <select
            id="login-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {roles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="login-form-options">
            <label className="login-remember">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="login-forgot">Forgot password?</span>
          </div>

          <button type="submit" className="primary-button login-submit">
            Sign In
          </button>

          <p className="login-demo-note">
            Demo mode: credentials are not verified.
          </p>
        </form>
      </div>
    </div>
  );
}