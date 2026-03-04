import TaskItem from './TaskItem';
import { Task } from '../types/task';

export default function TaskList({
  tasks,
  refresh,
}: {
  tasks: Task[];
  refresh: () => void;
}) {
  return (
    <ul>
      {tasks.map(t => (
        <TaskItem key={t.ROWID} task={t} onDelete={refresh} />
      ))}
    </ul>
  );
}