import { useNavigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import styles from './Layout.module.css';

export function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Todo App</h1>
        <div className={styles.userRow}>
          <span className={styles.userName}>
            {user?.name} <span className={styles.role}>({user?.role})</span>
          </span>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
