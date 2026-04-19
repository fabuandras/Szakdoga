import { useEffect, useState } from 'react';
import axios from 'axios';

export const useUsersData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:8000/api/users', { headers, withCredentials: true });
        if (!mounted) return;
        setUsers(res.data.users || []);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return {
    users,
    setUsers,
    loading,
    error,
    query,
    setQuery,
  };
};
