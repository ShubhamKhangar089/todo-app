import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/authSlice';
import type { Role } from '../types/auth';
import styles from './Auth.module.css';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, isLoading, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, [token, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
          />
          <label className={styles.label}>
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
