import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTodos } from '../store/todosSlice';
import { usersApi } from '../api/usersApi';
import { TodoForm } from '../components/TodoForm';
import { TodoItem } from '../components/TodoItem';
import styles from './Dashboard.module.css';
import type { ApiUser } from '../api/usersApi';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items, isLoading, error } = useAppSelector((s) => s.todos);
  const isAdmin = user?.role === 'admin';
  const [users, setUsers] = useState<ApiUser[]>([]);
  const todosFetchedRef = useRef(false);
  const usersFetchedRef = useRef(false);
  const userIdRef = useRef(user?.id);

  // Reset fetch refs when logged-in user changes (e.g. after re-login)
  if (userIdRef.current !== user?.id) {
    userIdRef.current = user?.id;
    todosFetchedRef.current = false;
    usersFetchedRef.current = false;
  }

  // Single fetch per mount (avoids double call from Strict Mode)
  useEffect(() => {
    if (todosFetchedRef.current) return;
    todosFetchedRef.current = true;
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    if (!isAdmin || usersFetchedRef.current) return;
    usersFetchedRef.current = true;
    usersApi.getUsers().then(setUsers).catch(() => setUsers([]));
  }, [isAdmin]);

  if (isLoading && items.length === 0) {
    return <p className={styles.message}>Loading tasks...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heading}>
        {isAdmin ? 'Admin Dashboard — All tasks' : 'My tasks'}
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      <TodoForm users={isAdmin ? users : undefined} />
      {items.length === 0 ? (
        <p className={styles.message}>No tasks yet. Add one above.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
