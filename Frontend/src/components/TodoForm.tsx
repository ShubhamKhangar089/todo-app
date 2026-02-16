import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTodo } from '../store/todosSlice';
import type { ApiUser } from '../api/usersApi';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  users?: ApiUser[]; // admin: show assign dropdown
}

export function TodoForm({ users }: TodoFormProps) {
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((s) => s.auth.user?.role) === 'admin';
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(currentUserId ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    dispatch(
      createTodo(
        isAdmin && users?.length && assignedTo ? { title: t, assignedTo } : { title: t }
      )
    );
    setTitle('');
    if (!isAdmin) setAssignedTo(currentUserId ?? '');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className={styles.input}
        maxLength={200}
      />
      {isAdmin && users && users.length > 0 && (
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className={styles.select}
        >
          <option value="">Assign to...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      )}
      <button type="submit" className={styles.btn}>
        Add
      </button>
    </form>
  );
}
