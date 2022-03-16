import {async} from 'regenerator-runtime';
import {API_URL, RES_PER_PAGE, KEY} from './config.js';
import { AJAX } from './helpers.js'

// console.log(`model Res_Per_Page = ${Res_Per_Page}`)

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, 
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
}

const createRecipeObject = function(data) {
  const { recipe } = data.data;
      // when the following code was in loadRecipe, it used state.recipe = data.data.recipe
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
          ...(recipe.key && {key: recipe.key }),
      };
}

// loadRecipe manipulates state.recipe defined above. 
export const loadRecipe = async function(id) {
  try {
      const data = await AJAX(`${API_URL}${id}`)
      state.recipe = createRecipeObject(data);

      if(state.bookmarks.some(bookmark => bookmark.id === id)) 
        state.recipe.bookmarked = true
      else
        state.recipe.bookmarked = false
    }  catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
  }

  export const loadSearchResults = async function(query) {
    try {
      state.search.query = query;

      const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
      console.log(data);

      state.search.results = data.data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && {key: rec.key })
        }
      })
      state.search.page = 1;
    } catch (err) {
      console.error(`${err} 💥💥💥💥`);
      throw err;
    }
  }

  export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; // 0;
    const end = page * state.search.resultsPerPage; // 9;

    return state.search.results.slice(start, end)
  }

  export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = ing.quantity * newServings / state.recipe.servings;
      // newQt = oldQt * newServings / oldServings //  2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
  }

  const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  }

  export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
  }

  export const deleteBookmark = function (id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    
    // Mark current recipe as no longer bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
  }

  const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
  }
  init();

  const clearBookmarks = function () {
    localStorage.clear('bookmarks');
  }
  // clearBookmarks();

  export const uploadRecipe = async function(newRecipe) {
    try {
        // we want to use map, but to use map we need to convert our newRecipe object into an array. We do that with Object.entries. Also - we only want ingredients whose key starts with "ingredient". Thus, we use the filter. 
      console.log(Object.entries(newRecipe));
      const ingredients = Object.entries(newRecipe).filter(
        entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
          // each ingredient is still an array. We need to do the replaceAll on the second element of the entry, the "value" part of the entry. That's why we code [1] just before replaceAll in the next line.
          const ingArr = ing[1].split(',').map(el => el.trim());
          if(ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient format. If there is no unit or description, code multiple commas in a row.'
            );

          const [quantity, unit, description] = ingArr;
          //if there's no quantity we return a null. If there is a quantity, we need to convert it to a number. User Training:  if there's no unit, code two commas in a row; otherwise "undefined" will be returned in the next line, but we need an empty string. 
          return { quantity: quantity ? +quantity : null, unit, description }
        })

        const recipe = {
          title: newRecipe.title,
          source_url: newRecipe.sourceUrl,
          image_url: newRecipe.image,
          publisher: newRecipe.publisher,
          cooking_time: +newRecipe.cookingTime,
          servings: +newRecipe.servings,
          ingredients, 
        }

        console.log(recipe);
      // forkify-api.herokuapp.com/v2
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch(err) {
      throw err;
    }
  }
  