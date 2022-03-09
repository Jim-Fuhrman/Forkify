import {async} from 'regenerator-runtime';
import {Api_Url, Res_Per_Page} from './config.js';
import { getJSON } from './helpers.js'

console.log(`model Res_Per_Page = ${Res_Per_Page}`)

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, 
    resultsPerPage: Res_Per_Page,
  },
}

// loadRecipe manipulates state.recipe defined above. 
export const loadRecipe = async function(id) {
  try {
    const data = await getJSON(`${Api_Url}${id}`)

        const { recipe } = data.data;
        // state.recipe = data.data.recipe
        state.recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients
        };
        console.log(state.recipe)
      }  catch (err) {
          console.error(`${err} 💥💥💥💥`);
          throw err;
      }
  }

  export const loadSearchResults = async function(query) {
    try {
      state.search.query = query;

      const data = await getJSON(`${Api_Url}?search=${query}`);
      console.log(data);

      state.search.results = data.data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
        }
      })
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