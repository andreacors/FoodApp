import { useState, useEffect } from 'react'
import styles from './search.module.css'

export default function Search({ setFoodData }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
        if (!apiKey) {
          throw new Error('VITE_SPOONACULAR_API_KEY is not configured');
        }

        const params = new URLSearchParams({
          query,
          apiKey,
        });
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?${params}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Recipe search failed (${res.status})`);
        }

        const data = await res.json();
        setFoodData(Array.isArray(data.results) ? data.results : []);
        setError('');
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;

        console.error('Error searching recipes:', requestError);
        setFoodData([]);
        setError('Unable to load recipes. Please try again.');
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, setFoodData]);

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}