import { LOGIN_URL } from "../api";
import "../styles/auth.css";

export default function Login() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">📝</div>

        <h2 className="auth-title">Task Manager</h2>
        <p className="auth-subtitle">
          Organize your tasks. Stay productive.
        </p>

        <button
          className="login-btn"
          onClick={() => {
            window.location.href = LOGIN_URL;
          }}
        >
          Continue with Zoho
        </button>

        <p className="auth-footer">
          Secure authentication powered by Zoho
        </p>
      </div>
    </div>
  );
}