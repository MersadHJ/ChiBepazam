import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import { searchRecipes, fetchRecipeDetails } from './utils/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError('');
    try {
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (error) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecipeDetails = async (recipe) => {
    if (expandedRecipeId === recipe.id) {
      setExpandedRecipeId(null); // Collapse if already expanded
    } else {
      setExpandedRecipeId(recipe.id);
      if (!recipeDetails[recipe.id]) {
        // Fetch details if not already fetched
        const details = await fetchRecipeDetails(recipe.id);
        setRecipeDetails((prev) => ({ ...prev, [recipe.id]: details }));
      }
    }
  };

  return (
    <div>
      <h1>Recipe Finder</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {recipes.map((recipe) => (
            <div key={`${recipe.source}-${recipe.id}`}>
              <div
                style={{ cursor: 'pointer', marginBottom: '10px' }}
                onClick={() => toggleRecipeDetails(recipe)}
              >
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} style={{ width: '200px' }} />
              </div>
              {expandedRecipeId === recipe.id && recipeDetails[recipe.id] && (
                <div>
                  <h3>Details</h3>
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipeDetails[recipe.id].ingredients.map((item, index) => (
                      <li key={index}>
                        {item.measure} {item.ingredient}
                      </li>
                    ))}
                  </ul>
                  <h4>Instructions:</h4>
                  <p>{recipeDetails[recipe.id].instructions}</p>
                  <h4>Category:</h4>
                  <p>{recipeDetails[recipe.id].category}</p>
                  <h4>Area:</h4>
                  <p>{recipeDetails[recipe.id].area}</p>
                  {recipeDetails[recipe.id].youtube && (
                    <div>
                      <h4>YouTube:</h4>
                      <a
                        href={recipeDetails[recipe.id].youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                  {recipeDetails[recipe.id].source && (
                    <div>
                      <h4>Source:</h4>
                      <a
                        href={recipeDetails[recipe.id].source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Original Recipe
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;