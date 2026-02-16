import { useState, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateTodo, deleteTodo } from '../store/todosSlice';
import type { Todo } from '../types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
}

function TodoItemInner({ todo }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((s) => s.auth.user?.role) === 'admin';
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleToggle = () => {
    dispatch(updateTodo({ id: todo._id, payload: { completed: !todo.completed } }));
  };

  const handleSaveEdit = () => {
    const t = editTitle.trim();
    if (t && t !== todo.title) {
      dispatch(updateTodo({ id: todo._id, payload: { title: t } }));
    }
    setEditing(false);
  };

  const handleDelete = () => {
    if (isAdmin) dispatch(deleteTodo(todo._id));
  };

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className={styles.checkbox}
      />
      <div className={styles.content}>
        {editing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            autoFocus
            className={styles.editInput}
          />
        ) : (
          <span
            className={styles.title}
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
        )}
        {isAdmin && (todo.createdBy || todo.assignedTo) && (
          <div className={styles.meta}>
            {todo.createdBy && (
              <span>Created by: {todo.createdBy.name}</span>
            )}
            {todo.assignedTo && (
              <span>Assigned to: {todo.assignedTo.name}</span>
            )}
          </div>
        )}
      </div>
      {isAdmin && (
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          title="Delete (admin only)"
        >
          Delete
        </button>
      )}
    </li>
  );
}

export const TodoItem = memo(TodoItemInner);
