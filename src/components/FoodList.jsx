import FoodItem from "./FoodItem";

export default function FoodList({ foodData, setFoodData, setFoodId }) {
  return (
    <div>
      {foodData.map((food, index) => (
        <div key={index}>
          <FoodItem food={food} key={food.id} setFoodId={setFoodId} />
        </div>
      ))}
    </div>
  );
} 