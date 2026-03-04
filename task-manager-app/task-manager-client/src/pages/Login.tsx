import { LOGIN_URL } from "../api";
import "../styles/auth.css";

export default function Login() {
  return (
    <div className="auth-container">
      <h2>Task Manager</h2>
      <p>Please sign in to continue</p>
      <button
        className="login-btn"
        onClick={() => {
          window.location.href = LOGIN_URL;
        }}
      >
        Login with Zoho
      </button>
    </div>
  );
}