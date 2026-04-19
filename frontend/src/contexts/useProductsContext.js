import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProductsData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:8000/api/items', { headers, withCredentials: true });
        if (!mounted) return;
        const payload = Array.isArray(res.data) ? res.data : (res.data.products || res.data.items || res.data || []);
        setProducts(Array.isArray(payload) ? payload : []);
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
    products,
    setProducts,
    loading,
    error,
    query,
    setQuery,
  };
};
