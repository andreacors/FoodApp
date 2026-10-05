import { useEffect, useState } from 'react';
import styles from './foodDetail.module.css';
import ItemList from './ItemList';

export default function FoodDetail({ foodId }) {
  const [food, setFood] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [instructionText, setInstructionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    if (!foodId) {
      setFood(null);
      setInstructions([]);
      setInstructionText('');
      setError('');
      setLoading(false);
      return () => controller.abort();
    }

    const fetchFoodDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
        if (!apiKey) {
          throw new Error('VITE_SPOONACULAR_API_KEY is not configured');
        }

        const params = new URLSearchParams({ apiKey });
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${foodId}/information?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Recipe details failed (${response.status})`);
        }

        const data = await response.json();
        const steps = Array.isArray(data.analyzedInstructions)
          ? data.analyzedInstructions.flatMap((section) =>
              Array.isArray(section.steps) ? section.steps : []
            )
          : [];

        setFood(data);
        setInstructions(steps);
        setInstructionText(
          steps.length === 0 && typeof data.instructions === 'string'
            ? data.instructions
            : ''
        );
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;

        console.error('Error fetching food detail:', requestError);
        setFood(null);
        setInstructions([]);
        setInstructionText('');
        setError('Unable to load this recipe. Please try again.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFoodDetail();
    return () => controller.abort();
  }, [foodId]);

  return (
    <div> 
      {error && <p role="alert">{error}</p>}
      <div className={styles.foodDetailHeader}>
        <h1 className={styles.recipeTitle}>{food?.title}</h1>
        <img 
          className={styles.recipeImage}
          src={food?.image} alt={food?.title} />
      </div>
      <div className={styles.foodDetailInfo}>
        <span><strong>Description:</strong>{food?.readyInMinutes} minutes</span>
        <span>{food?.vegetarian ? "Vegetarian" : "Non-Vegetarian"}</span>
        <span>{food?.vegan ? "Vegan" : "Non-Vegan"}</span>
        <span><strong>Servings:</strong>{food?.servings}</span>      <span><strong>Calories:</strong>{food?.calories}</span>
      </div>
        <div>
          <span><strong>Price:</strong>${food?.pricePerServing / 100}</span>
        </div>
      <div className={styles.foodInstructions}>
        <h2>Instructions</h2>
        {loading ? (
          <p>Loading instructions...</p>
        ) : instructions.length > 0 ? (
          <ul>
            {instructions.map((step, index) => (
              <li key={index}>{step.step}</li>
            ))}
          </ul>
        ) : (
          <p>{instructionText || 'No instructions available.'}</p>
        )}
      </div>
      <h2>Ingredients</h2>
        <ItemList items={food?.extendedIngredients || []} loading={loading} />
    </div>
  );
}