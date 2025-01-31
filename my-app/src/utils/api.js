import axios from 'axios';

const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Function to search TheMealDB API
export const searchRecipes = async (query) => {
  try {
    const response = await axios.get(`${THEMEALDB_BASE_URL}/search.php`, {
      params: {
        s: query,
      },
    });
    return response.data.meals
      ? response.data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          source: 'TheMealDB',
        }))
      : [];
  } catch (error) {
    console.error('Error fetching recipes from TheMealDB:', error);
    return [];
  }
};

// Function to fetch TheMealDB recipe details
export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${THEMEALDB_BASE_URL}/lookup.php`, {
      params: {
        i: id,
      },
    });
    const meal = response.data.meals[0];

    // Extract ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ ingredient, measure });
      }
    }

    return {
      ingredients,
      instructions: meal.strInstructions,
      category: meal.strCategory,
      area: meal.strArea,
      youtube: meal.strYoutube,
      source: meal.strSource,
    };
  } catch (error) {
    console.error('Error fetching TheMealDB recipe details:', error);
    return null;
  }
};