import "../styles/Header.css";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout?: () => void;
}

export default function Header({
  darkMode,
  onToggleDark,
  onLogout,
}: HeaderProps) {
  return (
    <header className="app-header">
      <h1>Task Manager</h1>

      <div className="header-actions">
        <button className="theme-btn" onClick={onToggleDark}>
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        {onLogout && (
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}