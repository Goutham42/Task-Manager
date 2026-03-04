import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { api, TASKS_URL } from "../api";
import { Task } from "../types/task";

import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

import { toast } from "../utils/toast";
import "../styles/dashboard.css";

type Filter = "all" | "completed" | "pending";

export default function Dashboard() {
  const navigate = useNavigate();

  /* -------------------- STATE -------------------- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState(""); // 🔍 SEARCH

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* -------------------- LOAD TASKS -------------------- */
  const loadTasks = useCallback(async () => {
    try {
      const res = await api.get(TASKS_URL);

      const normalized: Task[] = res.data.map((t: any) => ({
        ROWID: t.ROWID,
        title: t.title,
        description: t.description,
        completed: t.completed ?? t.status === "completed",
      }));

      setTasks(normalized);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login", { replace: true });
      } else {
        console.error("Load tasks failed:", err);
        toast("Failed to load tasks ❌");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* -------------------- FILTER + SEARCH -------------------- */
  const visibleTasks = tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter(task =>
      `${task.title} ${task.description || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return <div className="center">Authenticating…</div>;
  }

  /* -------------------- UI -------------------- */
  return (
    <>
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(v => !v)}
        onLogout={handleLogout}
      />

      <main className="dashboard">
        <TaskForm
          onAdd={() => {
            toast("Task added ✅");
            loadTasks();
          }}
        />

        {/* 🔍 SEARCH */}
        <input
          className="search"
          placeholder="Search tasks..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {/* 🎯 FILTER PILLS */}
        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Done
          </button>
        </div>

        <ul className="task-list">
          {visibleTasks.length === 0 && (
            <li className="empty">No tasks found</li>
          )}

          {visibleTasks.map(task => (
            <TaskItem
              key={task.ROWID}
              task={task}
              onDelete={() => {
                toast("Task updated 🧹");
                loadTasks();
              }}
            />
          ))}
        </ul>
      </main>
    </>
  );
}