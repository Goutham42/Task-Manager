import { useState } from "react";
import { Task } from "../types/task";
import { api, TASKS_URL } from "../api";
import { toast } from "../utils/toast"; // ✅ add this

interface Props {
  task: Task;
  onDelete: () => void;
}

export default function TaskItem({ task, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(task.description || "");

  const handleDelete = async () => {
    try {
      await api.delete(`${TASKS_URL}/${task.ROWID}`);
      toast("Task deleted 🗑"); // 🎉
      onDelete();
    } catch {
      toast("Delete failed ❌");
    }
  };

  const handleToggle = async () => {
    try {
      await api.put(`${TASKS_URL}/${task.ROWID}`, {
        status: task.completed ? "pending" : "completed",
      });

      toast(task.completed ? "Marked as pending ⏪" : "Task completed ✅");
      onDelete();
    } catch {
      toast("Update failed ❌");
    }
  };

  const saveDescription = async () => {
    try {
      await api.put(`${TASKS_URL}/${task.ROWID}`, {
        description,
      });

      toast("Description saved ✏️");
      setEditing(false);
      onDelete();
    } catch {
      toast("Failed to save description ❌");
    }
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <span className="task-title">{task.title}</span>

        {editing ? (
          <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={saveDescription}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();   // 🚫 stop form submit
                  saveDescription();    // ✅ save description
                }
              }}
              autoFocus
            />
        ) : (
          <span
            className="task-desc"
            onClick={() => setEditing(true)}
          >
            {description || "Click to add description"}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button onClick={handleToggle}>
          {task.completed ? "Undo" : "Done"}
        </button>
        <button className="delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}