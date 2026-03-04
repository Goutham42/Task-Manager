import { useState } from "react";
import { api, TASKS_URL } from "../api";
import { toast } from "../utils/toast"; // ✅ add this

export default function TaskForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(TASKS_URL, {
        title,
        description,
      });

      toast("Task added ✅"); // 🎉
      setTitle("");
      setDescription("");
      onAdd();
    } catch (err) {
      console.error(err);
      toast("Failed to add task ❌"); // 🚨
    }
  };

  return (
    <form onSubmit={submit} className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button type="submit">Add</button>
    </form>
  );
}